import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeResourceImport,
  deterministicImportId,
  getResourcePublicationErrors,
  importReadyDrafts,
  parseResourceImportFile,
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
