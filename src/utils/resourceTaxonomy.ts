export const RESOURCE_TYPE_OPTIONS = [
  { value: 'online_courses_platforms', label: 'Online Courses & Platforms' },
  { value: 'books_reading_materials', label: 'Books & Reading Materials' },
  { value: 'interactive_tools_apps', label: 'Interactive Tools & Apps' },
  { value: 'ai_powered_games_simulations', label: 'AI-Powered Games & Simulations' },
  { value: 'youtube_channels_video_resources', label: 'YouTube Channels & Video Resources' },
  { value: 'hands_on_ai_projects_activities', label: 'Hands-on AI Projects & Activities' },
  { value: 'ai_camps_webinars_live_classes', label: 'AI Camps, Webinars & Live Classes' },
] as const;

export const DEFAULT_FORMAT_OPTIONS = [
  'Online Course',
  'Book',
  'Interactive Tool',
  'Game',
  'Video',
  'Tutorial',
  'Activity',
  'Camp',
] as const;

const formatAliasMap: Record<string, string> = {
  course: 'Online Course',
  'course/tool': 'Interactive Tool',
  'learning platform': 'Online Course',
  'ai tool': 'Interactive Tool',
  curriculum: 'Book',
  experiments: 'Activity',
};

const resourceTypeLabelMap: Record<string, string> = Object.fromEntries(
  RESOURCE_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

const legacyResourceTypeMap: Record<string, string> = {
  online_course: 'online_courses_platforms',
  book: 'books_reading_materials',
  interactive_tool: 'interactive_tools_apps',
  ai_tool: 'interactive_tools_apps',
  game: 'ai_powered_games_simulations',
  video: 'youtube_channels_video_resources',
  tutorial: 'hands_on_ai_projects_activities',
  activity: 'hands_on_ai_projects_activities',
  camp: 'ai_camps_webinars_live_classes',
  curriculum: 'books_reading_materials',
};

export const normalizeResourceType = (value: string) => legacyResourceTypeMap[value] || value;

export const getResourceTypeLabel = (value: string) =>
  resourceTypeLabelMap[normalizeResourceType(value)] ||
  value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const parseFormatTags = (value?: string | string[] | null): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .map((item) => formatAliasMap[item.toLowerCase()] || item)
      .filter(Boolean);
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .map((item) => formatAliasMap[item.toLowerCase()] || item)
    .filter(Boolean);
};

export const formatTagsToStorage = (tags: string[]) =>
  Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))).join(', ');
