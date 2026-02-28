# Resource Upload Guide

## Overview

This guide provides the optimal JSON structure for uploading the 68+ resources from the Kids AI Resources Directory PDF into your database. The structure follows your existing resource schema and includes all necessary fields for proper categorization and filtering.

## Recommended JSON Structure

```json
{
  "resources": [
    {
      "title": "Resource Name",
      "description": "Detailed description of the resource",
      "url": "https://example.com/resource",
      "ageRanges": ["4-7", "8-10", "11-13", "14-17"],
      "resourceType": "online_courses_platforms",
      "format": "Online Course",
      "cost": "free",
      "learningOutcomes": ["Outcome 1", "Outcome 2"],
      "skillsAttained": ["Skill 1", "Skill 2"],
      "keyFeatures": ["Feature 1", "Feature 2"],
      "imageUrl": "https://example.com/image.jpg",
      "addedBy": "admin",
      "isApproved": true,
      "isFeatured": false
    }
  ]
}
```

## Field Definitions

### Required Fields

- **title** (string): Resource name
- **description** (string): Detailed description
- **url** (string): Resource URL
- **ageRanges** (array): Age ranges (use: "4-7", "8-10", "11-13", "14-17")
- **resourceType** (string): Resource category
- **cost** (string): "free" or "paid"

### Optional Fields

- **format** (string): Format type (see format options below)
- **learningOutcomes** (array): Educational outcomes
- **skillsAttained** (array): Skills developed
- **keyFeatures** (array): Key features
- **imageUrl** (string): Resource image URL
- **addedBy** (string): "admin"
- **isApproved** (boolean): true
- **isFeatured** (boolean): false

## Resource Type Mappings

Based on the PDF categories, map to these resource types:

| PDF Category                       | Resource Type                      |
| ---------------------------------- | ---------------------------------- |
| Online Courses & Platforms         | `online_courses_platforms`         |
| Books & Reading Materials          | `books_reading_materials`          |
| Interactive Tools & Apps           | `interactive_tools_apps`           |
| AI-Powered Games & Simulations     | `ai_powered_games_simulations`     |
| YouTube Channels & Video Resources | `youtube_channels_video_resources` |
| Hands-On AI Projects & Activities  | `hands_on_ai_projects_activities`  |
| AI Camps, Webinars & Live Classes  | `ai_camps_webinars_live_classes`   |

## Format Options

Use these format types (from your updated format options):

- "Online Course"
- "Book"
- "Interactive Tool"
- "Game"
- "Video"
- "Tutorial"
- "Activity"
- "Camp"
- "Live Class"
- "Webinar"
- "App"
- "Web Tool"
- "Worksheet"

## Example Resource Entry

```json
{
  "title": "Code.org AI Foundations",
  "description": "A free, beginner-friendly course offering an accessible introduction to AI concepts through engaging coding activities. Specifically designed for younger learners to grasp AI basics in a fun, interactive way.",
  "url": "https://code.org/ai",
  "ageRanges": ["8-10"],
  "resourceType": "online_courses_platforms",
  "format": "Interactive Tool",
  "cost": "free",
  "learningOutcomes": [
    "Computational thinking",
    "Logical reasoning",
    "Problem-solving through AI-related coding exercises",
    "Basic programming concepts"
  ],
  "skillsAttained": [
    "Coding skills",
    "AI concept understanding",
    "Problem-solving"
  ],
  "keyFeatures": [
    "Interactive coding puzzles",
    "Fun challenges motivate students",
    "No sign-up required to start"
  ],
  "imageUrl": "https://code.org/images/logo.png",
  "addedBy": "admin",
  "isApproved": true,
  "isFeatured": false
}
```

## Batch Upload Strategy

### Option 1: Single JSON File

Create one large JSON file with all 68+ resources:

```json
{
  "resources": [
    // All resource entries here
  ]
}
```

### Option 2: Multiple Smaller Files

Split by category for easier management:

- `online_courses.json`
- `books.json`
- `interactive_tools.json`
- `ai_games.json`
- `videos.json`
- `hands_on_projects.json`
- `camps_webinars.json`

## Upload Methods

### Method 1: Admin Dashboard

1. Use your existing admin interface
2. Import resources one by one or in batches
3. Verify each entry matches the format

### Method 2: SQL Bulk Insert

Use your SQL template generator for bulk uploads:

```sql
INSERT INTO public.resources (
  title, description, url, resource_type, cost, age_ranges,
  format, learning_outcomes, skills_attained, key_features,
  image_url, added_by, is_approved, is_featured
) VALUES
  ('Resource 1', 'Description', 'https://...', 'online_courses_platforms', 'free', ARRAY['8-10'], 'Interactive Tool', ARRAY['Outcome 1'], ARRAY['Skill 1'], ARRAY['Feature 1'], 'https://...', 'admin', true, false),
  ('Resource 2', 'Description', 'https://...', 'books_reading_materials', 'paid', ARRAY['4-7'], 'Book', ARRAY['Outcome 2'], ARRAY['Skill 2'], ARRAY['Feature 2'], 'https://...', 'admin', true, false);
```

### Method 3: Backend API

If you have an API endpoint, POST the JSON data:

```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d @resources.json
```

## Quality Assurance Checklist

Before uploading:

- [ ] All required fields present
- [ ] Age ranges use correct format ("4-7", "8-10", "11-13", "14-17")
- [ ] Resource types match your schema
- [ ] Format types use approved options
- [ ] URLs are valid and accessible
- [ ] Descriptions are accurate and engaging
- [ ] Cost field correctly marked as "free" or "paid"
- [ ] JSON syntax is valid

## Next Steps

1. **Prepare Data**: Convert PDF content to JSON using the structure above
2. **Validate**: Check JSON syntax and required fields
3. **Test**: Upload a few sample resources first
4. **Verify**: Check that resources display correctly in your application
5. **Bulk Upload**: Import all remaining resources
6. **Review**: Test filtering and search functionality

## Support

If you need help with the upload process or encounter any issues, refer to:

- Your admin dashboard documentation
- The SQL template generator for bulk operations
- Your backend API documentation

This structure ensures all resources will be properly categorized, filterable, and display correctly in your Kids AI Resource Hub application.
