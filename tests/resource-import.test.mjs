import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeResourceImport,
  deterministicImportId,
  getResourcePublicationErrors,
  importReadyDrafts,
  parseResourceImportFile,
  retryFailedDrafts,
  toggleSupportedAgeRange,
} from '../src/services/resourceImportService.ts';

test('parses JSON envelopes and maps records into unpublished drafts', () => {
  const parsed = parseResourceImportFile(JSON.stringify({ resources: [{ id: 'src-1', title: 'Tool', description: 'A tool', category: 'Interactive Tools & Apps', formats: ['AI Tool'], ageRanges: ['8-10'], cost: 'free' }] }), 'source.json');
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].sourceId, 'src-1');
  assert.equal(parsed[0].resource.is_approved, false);
  assert.equal(parsed[0].resource.resource_type, 'interactive_tools_apps');
  assert.equal(parsed[0].resource.format, 'Interactive Tool');
  assert.equal(parsed[0].resource.url, '');
  assert.equal(parsed[0].resource.image_url, '');
  assert.equal(deterministicImportId('src-1'), deterministicImportId('src-1'));
});

test('parses quoted CSV fields and retains multiline source text', () => {
  const parsed = parseResourceImportFile('source_id,title,description,category,cost\n"csv-1","Learning, AI","Line one\nLine two","Books & Reading Materials",free\n', 'review.csv');
  assert.equal(parsed[0].resource.title, 'Learning, AI');
  assert.equal(parsed[0].resource.description, 'Line one\nLine two');
  assert.equal(parsed[0].resource.resource_type, 'books_reading_materials');
});

test('missing URL and image are warnings and do not block draft eligibility', () => {
  const parsed = parseResourceImportFile(JSON.stringify([{ source_id: 'no-links', title: 'Draft candidate' }]), 'source.json');
  const analysis = analyzeResourceImport(parsed);
  assert.equal(analysis.counts.ready, 1);
  assert.equal(analysis.missingUrls, 1);
  assert.equal(analysis.missingImages, 1);
  assert.ok(parsed[0].warnings.some((warning) => warning.includes('URL')));
});

test('flags existing and in-file matches without discarding their source records', () => {
  const parsed = parseResourceImportFile(JSON.stringify([
    { source_id: 'one', title: 'Existing Resource' },
    { source_id: 'two', title: 'Existing Resource' },
    { source_id: 'three', title: 'New Resource' },
  ]), 'source.json');
  const analysis = analyzeResourceImport(parsed, [{ id: 'live-1', title: 'Existing Resource', url: '' }]);
  assert.equal(analysis.records.length, 3);
  assert.equal(analysis.counts.duplicate_review, 2);
  assert.equal(analysis.counts.ready, 1);
});

test('recognizes previously imported source IDs and import retries are create-only', async () => {
  const parsed = parseResourceImportFile(JSON.stringify([{ source_id: 'one', title: 'One' }, { source_id: 'two', title: 'Two' }]), 'source.json');
  const analysis = analyzeResourceImport(parsed, [{ id: 'imported-one', source_id: 'one', title: 'One' }]);
  assert.equal(analysis.counts.already_imported, 1);
  const stored = new Map();
  const createIfAbsent = async (resource) => {
    if (stored.has(resource.id)) return 'already_exists';
    stored.set(resource.id, resource);
    return 'created';
  };
  await importReadyDrafts(analysis.records, createIfAbsent);
  const first = stored.size;
  const retry = parseResourceImportFile(JSON.stringify([{ source_id: 'two', title: 'Two' }]), 'source.json');
  const retryAnalysis = analyzeResourceImport(retry);
  const counts = await importReadyDrafts(retryAnalysis.records, createIfAbsent);
  assert.equal(first, 1);
  assert.equal(counts.already_imported, 1);
  assert.equal(stored.size, 1);
});

test('canonical source_id wins over generic id regardless of object property order and remains idempotent', () => {
  const first = parseResourceImportFile(JSON.stringify([{ id: 'generic-one', source_id: 'KAR-001', title: 'Original' }]), 'source.json');
  const reordered = parseResourceImportFile(JSON.stringify([{ source_id: 'KAR-001', id: 'generic-two', title: 'Edited title' }]), 'source.json');
  assert.equal(first[0].sourceId, 'KAR-001');
  assert.equal(reordered[0].sourceId, 'KAR-001');
  assert.equal(first[0].resource.id, reordered[0].resource.id);
  const analysis = analyzeResourceImport(reordered, [{ id: first[0].resource.id, source_id: 'KAR-001', title: 'Original', url: '' }]);
  assert.equal(analysis.records[0].status, 'already_imported');
});

test('CSV alias priority is independent of column order', () => {
  const parsed = parseResourceImportFile('id,source_id,title\ngeneric,KAR-CSV-1,CSV item\n', 'source.csv');
  assert.equal(parsed[0].sourceId, 'KAR-CSV-1');
});

test('unsupported imported ages can be replaced, saved, and pass publication validation while source data remains intact', () => {
  const sourceData = { source_id: 'KAR-AGE-1', age_ranges: ['5-12'] };
  const imported = parseResourceImportFile(JSON.stringify([{ ...sourceData, title: 'Age draft', description: 'Details', url: 'https://example.org', resource_type: 'interactive_tools_apps', cost: 'free' }]), 'source.json')[0].resource;
  const editedAges = toggleSupportedAgeRange(imported.age_ranges, '8-10');
  assert.deepEqual(editedAges, ['8-10']);

  // Mirrors the Resource Editor save: only edited fields are patched, so source_data is retained.
  const savedDraft = { ...imported, age_ranges: editedAges };
  assert.deepEqual(savedDraft.source_data.age_ranges, ['5-12']);
  assert.deepEqual(getResourcePublicationErrors(savedDraft), []);
  const published = { ...savedDraft, is_approved: true };
  assert.equal(published.is_approved, true);
  assert.deepEqual(getResourcePublicationErrors(published), []);
});

test('failed records retry without rerunning successes or changing duplicate-review selections', async () => {
  const [success, transient, duplicate] = parseResourceImportFile(JSON.stringify([
    { source_id: 'retry-success', title: 'Saved' },
    { source_id: 'retry-transient', title: 'Transient' },
    { source_id: 'retry-duplicate', title: 'Duplicate' },
  ]), 'source.json');
  const records = [
    { ...success, status: 'ready' },
    { ...transient, status: 'ready' },
    { ...duplicate, status: 'duplicate_review', duplicateOf: 'existing-id' },
  ];
  const calls = new Map();
  const createIfAbsent = async (resource) => {
    const count = (calls.get(resource.source_id) || 0) + 1;
    calls.set(resource.source_id, count);
    if (resource.source_id === 'retry-transient' && count === 1) throw new Error('temporary network error');
    return 'created';
  };

  await importReadyDrafts(records, createIfAbsent);
  assert.equal(records[0].status, 'imported');
  assert.equal(records[1].status, 'failed');
  assert.equal(records[2].status, 'duplicate_review');

  const counts = await retryFailedDrafts(records, createIfAbsent);
  assert.equal(records[0].status, 'imported');
  assert.equal(records[1].status, 'imported');
  assert.equal(records[1].errors.length, 0);
  assert.equal(records[2].status, 'duplicate_review');
  assert.equal(records[2].duplicateOf, 'existing-id');
  assert.equal(calls.get('retry-success'), 1);
  assert.equal(calls.get('retry-transient'), 2);
  assert.equal(counts.imported, 2);
  assert.equal(counts.duplicate_review, 1);
});

test('publishing requires complete, valid publication fields', () => {
  assert.deepEqual(getResourcePublicationErrors({ title: 'Draft', description: '', url: '', resource_type: '', cost: '', age_ranges: [] }), [
    'Description is required.', 'A valid resource URL is required.', 'Resource type is required.', 'Choose a supported cost value (free, paid, subscription, or freemium).', 'At least one age range is required.',
  ]);
  assert.deepEqual(getResourcePublicationErrors({ title: 'Complete', description: 'Details', url: 'https://example.org', resource_type: 'tool', cost: 'free', age_ranges: ['8-10'] }), []);
});

test('rejects malformed JSON, CSV, and unsupported extensions', () => {
  assert.throws(() => parseResourceImportFile('{', 'source.json'), /Invalid JSON/);
  assert.throws(() => parseResourceImportFile('title,description\n"unterminated,desc', 'source.csv'), /unterminated quoted field/);
  assert.throws(() => parseResourceImportFile('[]', 'source.txt'), /Choose a/);
});
