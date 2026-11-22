export type ImportStatus = 'ready' | 'already_imported' | 'duplicate_review' | 'invalid' | 'failed' | 'imported';

const knownResourceTypes = [
  'online_courses_platforms', 'books_reading_materials', 'interactive_tools_apps',
  'ai_powered_games_simulations', 'youtube_channels_video_resources',
  'hands_on_ai_projects_activities', 'ai_camps_webinars_live_classes',
];

const typeAliases: Record<string, string> = {
  online_course: 'online_courses_platforms', book: 'books_reading_materials',
  interactive_tool: 'interactive_tools_apps', ai_tool: 'interactive_tools_apps',
  game: 'ai_powered_games_simulations', video: 'youtube_channels_video_resources',
  tutorial: 'hands_on_ai_projects_activities', activity: 'hands_on_ai_projects_activities',
  camp: 'ai_camps_webinars_live_classes', curriculum: 'books_reading_materials',
};

const normalizeResourceType = (value: string) => typeAliases[value] || value;
const formatAliases: Record<string, string> = {
  course: 'Online Course', 'course/tool': 'Interactive Tool', 'learning platform': 'Online Course',
  'ai tool': 'Interactive Tool', curriculum: 'Book', experiments: 'Activity',
};
const parseFormatTags = (values: unknown): string[] => {
  const tags = Array.isArray(values) ? values.map(asText) : asText(values).split(',');
  return tags.map((tag) => tag.trim()).map((tag) => formatAliases[tag.toLowerCase()] || tag).filter(Boolean);
};
const formatTagsToStorage = (tags: string[]) => Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))).join(', ');

export interface ImportedResourceDraft extends Record<string, unknown> {
  id: string;
  source_id: string;
  source_data: Record<string, unknown>;
  title: string;
  description: string;
  url: string;
  image_url: string;
  resource_type: string;
  cost: string;
  format: string;
  age_ranges: string[];
  learning_outcomes: string[];
  skills_attained: string[];
  key_features: string[];
  added_by: string;
  is_approved: false;
  is_featured: false;
}

export interface ImportRecord {
  sourceId: string;
  resource: ImportedResourceDraft | null;
  status: ImportStatus;
  errors: string[];
  warnings: string[];
  duplicateOf?: string;
}

export interface ImportAnalysis {
  records: ImportRecord[];
  counts: Record<ImportStatus, number>;
  missingUrls: number;
  missingImages: number;
}

const getValue = (row: Record<string, unknown>, ...keys: string[]) => {
  const entries = Object.entries(row);
  for (const key of keys) {
    const found = entries.find(([candidate]) => candidate === key)
      ?? entries.find(([candidate]) => normalizeKey(candidate) === normalizeKey(key));
    if (found) return found[1];
  }
  return undefined;
};

const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

const asText = (value: unknown) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
};

const asList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(asText).filter(Boolean);
  const text = asText(value);
  if (!text) return [];
  try {
    const parsed: unknown = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(asText).filter(Boolean);
  } catch {
    // CSV and legacy data often represent lists as comma- or semicolon-separated text.
  }
  return text.split(/[;,]/).map((part) => part.trim()).filter(Boolean);
};

const parseCsv = (text: string): Record<string, string>[] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted && char === '"' && text[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ',') {
      row.push(cell);
      cell = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell);
      if (row.some((field) => field.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  if (quoted) throw new Error('CSV contains an unterminated quoted field.');
  row.push(cell);
  if (row.some((field) => field.trim())) rows.push(row);
  if (rows.length < 2) throw new Error('CSV must contain a header and at least one record.');
  const headers = rows[0].map((header) => header.trim());
  if (headers.some((header) => !header)) throw new Error('CSV contains an empty column heading.');
  return rows.slice(1).map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])));
};

const stableSerialize = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => `${JSON.stringify(key)}:${stableSerialize(child)}`).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
};

const hash = (value: string) => {
  let first = 0xcbf29ce484222325n;
  let second = 0x84222325cbf29ce4n;
  for (const byte of new TextEncoder().encode(value)) {
    first = BigInt.asUintN(64, (first ^ BigInt(byte)) * 0x100000001b3n);
    second = BigInt.asUintN(64, (second ^ BigInt(byte)) * 0x100000001b3n);
  }
  return `${first.toString(16).padStart(16, '0')}${second.toString(16).padStart(16, '0')}`;
};

export const deterministicImportId = (sourceId: string) => `import_${hash(sourceId)}`;

const normalizeUrl = (value: string) => {
  try {
    const url = new URL(value);
    url.hash = '';
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return url.toString().replace(/\/$/, '');
  } catch {
    return value.trim().toLowerCase();
  }
};

const categoryToType = (value: string) => {
  const normalized = normalizeResourceType(value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''));
  const categoryAliases: Record<string, string> = {
    online_courses: 'online_courses_platforms',
    online_courses_platforms: 'online_courses_platforms',
    courses_platforms: 'online_courses_platforms',
    books: 'books_reading_materials',
    books_reading_materials: 'books_reading_materials',
    interactive_tools: 'interactive_tools_apps',
    interactive_tools_apps: 'interactive_tools_apps',
    games: 'ai_powered_games_simulations',
    games_simulations: 'ai_powered_games_simulations',
    ai_powered_games_simulations: 'ai_powered_games_simulations',
    videos_channels: 'youtube_channels_video_resources',
    videos: 'youtube_channels_video_resources',
    video_resources: 'youtube_channels_video_resources',
    youtube_channels_video_resources: 'youtube_channels_video_resources',
    projects_activities: 'hands_on_ai_projects_activities',
    projects: 'hands_on_ai_projects_activities',
    hands_on_projects: 'hands_on_ai_projects_activities',
    hands_on_ai_projects_activities: 'hands_on_ai_projects_activities',
    camps_webinars_classes: 'ai_camps_webinars_live_classes',
    camps_live_sessions: 'ai_camps_webinars_live_classes',
    camps_webinars_live_classes: 'ai_camps_webinars_live_classes',
    ai_camps_webinars_live_classes: 'ai_camps_webinars_live_classes',
  };
  const mapped = categoryAliases[normalized] || normalized;
  const known = knownResourceTypes.includes(mapped);
  return { value: mapped, mapped: known };
};

const mapResource = (raw: Record<string, unknown>, index: number): { sourceId: string; resource: ImportedResourceDraft; errors: string[]; warnings: string[] } => {
  const title = asText(getValue(raw, 'title', 'name', 'resourceTitle'));
  const description = asText(getValue(raw, 'description', 'summary', 'resourceDescription'));
  const sourceIdValue = asText(getValue(raw, 'source_id', 'sourceId', 'original_id', 'originalId', 'id', '_id'));
  const sourceId = sourceIdValue || `row-${index + 1}-${hash(stableSerialize(raw)).slice(0, 12)}`;
  const url = asText(getValue(raw, 'url', 'resource_url', 'resourceUrl', 'link', 'website'));
  const imageUrl = asText(getValue(raw, 'image_url', 'imageUrl', 'image', 'image_url'));
  const typeRaw = asText(getValue(raw, 'resource_type', 'resourceType', 'category', 'resourceCategory', 'type'));
  const type = categoryToType(typeRaw);
  const costRaw = asText(getValue(raw, 'cost', 'cost_type', 'costType', 'price'));
  const costKey = costRaw.toLowerCase().trim();
  const costAliases: Record<string, string> = { free: 'free', paid: 'paid', subscription: 'subscription', freemium: 'freemium', 'free / paid': 'freemium' };
  const cost = costAliases[costKey] || costRaw;
  const format = asList(getValue(raw, 'format_tags', 'formatTags', 'formats', 'format'));
  const ageRanges = asList(getValue(raw, 'age_ranges', 'ageRanges', 'age_range', 'ageRange', 'ages'));
  const learningOutcomes = asList(getValue(raw, 'learning_outcomes', 'learningOutcomes', 'outcomes'));
  const skillsAttained = asList(getValue(raw, 'skills_attained', 'skillsAttained', 'skills'));
  const keyFeatures = asList(getValue(raw, 'key_features', 'keyFeatures', 'features'));
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!title) errors.push('Title is required to create a resource record.');
  if (!description) warnings.push('Description is missing; this draft will need editing before publication.');
  if (!url) warnings.push('URL is missing; drafts can be saved without one.');
  if (!imageUrl) warnings.push('Image is missing; drafts can be saved without one.');
  if (!typeRaw) warnings.push('Resource type is missing.');
  else if (!type.mapped) warnings.push(`Resource type "${typeRaw}" was retained as "${type.value}"; review the mapping.`);
  if (costRaw && !costAliases[costKey]) warnings.push(`Cost "${costRaw}" was retained without normalization; review before publication.`);
  if (!ageRanges.length) warnings.push('Age range is missing; review age suitability before publication.');
  if (ageRanges.some((age) => !['4-7', '8-10', '11-13', '14-17'].includes(age))) warnings.push('One or more age ranges are outside the current filter options and were retained.');
  const resource: ImportedResourceDraft = {
    id: deterministicImportId(sourceId),
    source_id: sourceId,
    source_data: raw,
    title,
    description,
    url,
    image_url: imageUrl,
    resource_type: type.value,
    cost,
    format: formatTagsToStorage(parseFormatTags(format)),
    age_ranges: ageRanges,
    learning_outcomes: learningOutcomes,
    skills_attained: skillsAttained,
    key_features: keyFeatures,
    added_by: 'admin',
    is_approved: false,
    is_featured: false,
  };
  return { sourceId, resource, errors, warnings };
};

export const parseResourceImportFile = (contents: string, fileName: string) => {
  const extension = fileName.toLowerCase().split('.').pop();
  let rows: unknown;
  if (extension === 'json') {
    try {
      rows = JSON.parse(contents);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'could not parse file.'}`);
    }
    if (!Array.isArray(rows)) {
      const container = rows as Record<string, unknown>;
      rows = container.resources ?? container.records ?? container.items;
    }
  } else if (extension === 'csv') {
    rows = parseCsv(contents);
  } else {
    throw new Error('Choose a .json or .csv file.');
  }
  if (!Array.isArray(rows)) throw new Error('The file must contain a resource array or a resources, records, or items array.');
  if (!rows.every((row) => row && typeof row === 'object' && !Array.isArray(row))) throw new Error('Every resource must be a JSON object or CSV row.');
  return (rows as Record<string, unknown>[]).map(mapResource);
};

const normalizedTitle = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const analyzeResourceImport = (
  sourceRows: ReturnType<typeof parseResourceImportFile>,
  existing: Array<Record<string, unknown>> = [],
): ImportAnalysis => {
  const existingBySource = new Map<string, Record<string, unknown>>();
  existing.forEach((resource) => {
    const sourceId = asText(resource.source_id);
    if (sourceId) existingBySource.set(sourceId, resource);
  });
  const seenSource = new Map<string, ImportRecord>();
  const records: ImportRecord[] = sourceRows.map(({ sourceId, resource, errors, warnings }) => {
    if (errors.length) return { sourceId, resource, status: 'invalid', errors, warnings };
    const priorSource = seenSource.get(sourceId);
    if (priorSource) return { sourceId, resource, status: 'duplicate_review', errors, warnings: [...warnings, 'This source ID appears more than once in the uploaded file.'], duplicateOf: priorSource.sourceId };
    seenSource.set(sourceId, { sourceId, resource, status: 'ready', errors, warnings });
    if (existingBySource.has(sourceId)) return { sourceId, resource, status: 'already_imported', errors, warnings, duplicateOf: asText(existingBySource.get(sourceId)?.id) };
    const titleMatch = existing.find((item) => normalizedTitle(asText(item.title)) === normalizedTitle(resource.title));
    const resourceUrl = normalizeUrl(resource.url);
    const urlMatch = resourceUrl && existing.find((item) => asText(item.url) && normalizeUrl(asText(item.url)) === resourceUrl);
    const sourceDuplicate = sourceRows.find((other) => other.sourceId !== sourceId && (
      normalizedTitle(other.resource.title) === normalizedTitle(resource.title)
      || (resourceUrl && normalizeUrl(other.resource.url) === resourceUrl)
    ));
    const match = titleMatch || urlMatch;
    if (match || sourceDuplicate) {
      return {
        sourceId,
        resource,
        status: 'duplicate_review',
        errors,
        warnings: [...warnings, match ? 'A title or URL match exists in the current resource list.' : 'A title or URL match exists in this file.'],
        duplicateOf: asText(match?.id) || sourceDuplicate?.sourceId || asText(match?.title),
      };
    }
    return { sourceId, resource, status: 'ready', errors, warnings };
  });
  const countStatuses: ImportStatus[] = ['ready', 'already_imported', 'duplicate_review', 'invalid', 'failed', 'imported'];
  const counts = Object.fromEntries(countStatuses.map((status) => [status, records.filter((record) => record.status === status).length])) as Record<ImportStatus, number>;
  return {
    records,
    counts,
    missingUrls: records.filter((record) => !record.resource?.url).length,
    missingImages: records.filter((record) => !record.resource?.image_url).length,
  };
};

export const getResourcePublicationErrors = (resource: Record<string, unknown>) => {
  const errors: string[] = [];
  if (!asText(resource.title)) errors.push('Title is required.');
  if (!asText(resource.description)) errors.push('Description is required.');
  const url = asText(resource.url);
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) errors.push('URL must use HTTP or HTTPS.');
  } catch {
    errors.push('A valid resource URL is required.');
  }
  if (!asText(resource.resource_type)) errors.push('Resource type is required.');
  if (!['free', 'paid', 'subscription', 'freemium'].includes(asText(resource.cost).toLowerCase())) errors.push('Choose a supported cost value (free, paid, subscription, or freemium).');
  const ageRanges = asList(resource.age_ranges);
  if (!ageRanges.length) errors.push('At least one age range is required.');
  else if (ageRanges.some((age) => !['4-7', '8-10', '11-13', '14-17'].includes(age))) errors.push('Choose age ranges supported by the resource directory.');
  return errors;
};

export const toggleSupportedAgeRange = (current: string[], selected: string) => {
  if (!['4-7', '8-10', '11-13', '14-17'].includes(selected)) return current;
  const supportedCurrent = current.filter((age) => ['4-7', '8-10', '11-13', '14-17'].includes(age));
  return supportedCurrent.includes(selected)
    ? supportedCurrent.filter((age) => age !== selected)
    : [...supportedCurrent, selected];
};

export const importReadyDrafts = async (
  records: ImportRecord[],
  createIfAbsent: (resource: ImportedResourceDraft) => Promise<'created' | 'already_exists'>,
) => {
  for (const record of records) {
    if (record.status !== 'ready' || !record.resource) continue;
    try {
      const outcome = await createIfAbsent(record.resource);
      record.status = outcome === 'created' ? 'imported' : 'already_imported';
    } catch (error) {
      record.status = 'failed';
      record.errors = [...record.errors, error instanceof Error ? error.message : 'Resource could not be saved.'];
    }
  }
  const statuses: ImportStatus[] = ['ready', 'already_imported', 'duplicate_review', 'invalid', 'failed', 'imported'];
  const counts = Object.fromEntries(statuses.map((status) => [status, records.filter((record) => record.status === status).length])) as Record<ImportStatus, number>;
  return counts;
};

export const retryFailedDrafts = async (
  records: ImportRecord[],
  createIfAbsent: (resource: ImportedResourceDraft) => Promise<'created' | 'already_exists'>,
) => {
  records.forEach((record) => {
    if (record.status === 'failed') {
      record.status = 'ready';
      record.errors = [];
    }
  });
  return importReadyDrafts(records, createIfAbsent);
};
