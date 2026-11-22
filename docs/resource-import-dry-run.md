# Resource Import Dry Run

Prepared from the Notion staging attachments on 2026-11-22. This is a source validation report, not a production database export or import.

## Source reconciliation

- Primary JSON: 85 records and 85 unique `source_id` values.
- Supporting CSV: 85 records and the same 85 `source_id` values.
- Every source ID aligned across the two files; mapped values matched for title, description, URL, image, type, cost, format, age ranges, learning outcomes, skills, and key features.
- Use the JSON as the import file. The CSV is a reconciliation copy and must not be imported as a second batch.

## Source-only result

| Status or gap | Count |
| --- | ---: |
| Records ready before checking the live resource database | 67 |
| Potential duplicate records within the source, held for review | 18 |
| Invalid records (missing title) | 0 |
| Missing URLs | 17 |
| Missing images | 85 |
| Missing age ranges | 9 |

Potential duplicate review entries are: `KAR-002`, `KAR-022`, `KAR-029`, `KAR-041`, `KAR-042`, `KAR-043`, `KAR-044`, `KAR-046`, `KAR-049`, `KAR-052`, `KAR-053`, `KAR-064`, `KAR-072`, `KAR-073`, `KAR-074`, `KAR-077`, `KAR-078`, and `KAR-083`. The importer reports the matching source ID or existing title/URL and requires a deliberate per-record choice to keep a flagged item as its own draft.

## Field mapping

| Source field | Firestore field | Handling |
| --- | --- | --- |
| `source_id` | `source_id` | Preserved exactly; used for repeat-import recognition. A stable hashed document ID is derived from it. |
| `title` | `title` | Preserved. Missing title is invalid because it cannot be reviewed as a resource. |
| `description` | `description` | Preserved; a missing description warns and prevents publication until edited. |
| `url` | `url` | Preserved; missing URL becomes an empty draft value and does not block import. |
| `image_url` | `image_url` | Preserved; missing image becomes empty and does not block import. |
| `resource_type` | `resource_type` | Mapped to the existing seven resource taxonomy values listed below. Original data remains in `source_data`. |
| `cost` | `cost` | Known values are retained; `Free/Paid` and `Unknown` stay intact and are flagged for review. |
| `format` | `format` | Tags are normalized using the existing format aliases and stored comma-separated; original value remains in `source_data`. |
| `age_ranges` | `age_ranges` | Values are retained; empty or unsupported age ranges are flagged and must be reviewed before publication. |
| `learning_outcomes` | `learning_outcomes` | Preserved as an array. |
| `skills_attained` | `skills_attained` | Preserved as an array. |
| `key_features` | `key_features` | Preserved as an array. |
| Other source fields | `source_data` | Entire original source row is retained for traceability and unmapped information. |

Category mapping:

- Online Courses & Platforms → `online_courses_platforms` (9)
- Books & Reading Materials → `books_reading_materials` (12)
- Interactive Tools & Apps → `interactive_tools_apps` (5)
- Games & Simulations → `ai_powered_games_simulations` (12)
- Videos & Channels → `youtube_channels_video_resources` (10)
- Projects & Activities → `hands_on_ai_projects_activities` (9)
- Camps, Webinars & Classes → `ai_camps_webinars_live_classes` (28)

## Existing-record comparison limits

The checked-in `kids_ai_resources.json` contains 66 seed records. A title/URL comparison flags 64 source candidates as possible matches and leaves 21 without a match in that file. This file is a local seed reference; it does not prove what is in production. The active Firebase environment has no project selected, so production IDs, URLs, and approval states were not enumerated. The final eligible import count must come from the Admin Console preview against the intended database.

No production data was read or changed. The importer defaults every created record to `is_approved: false`, writes only when its deterministic document ID is absent, and reports an existing document with the same `source_id` as already imported.

## Local emulator preview verification

- Uploaded the primary JSON once to the Admin Console connected to a disposable Firestore emulator: 85 records found, 67 ready, 18 duplicate-review, 0 invalid, and 0 failed.
- Imported the 67 ready rows as unpublished drafts; the admin Drafts tab then showed 67 of 67. The remaining 18 source entries stayed visible for reconciliation and were not silently discarded.
- Uploaded the same JSON again: all 67 created records were classified as already imported; no additional records were created.
- Edited and saved one emulator draft, restored its original title, and verified it remained Pending.
- Public directory displayed zero resources in the empty public emulator view; Firestore rules tests separately verified public access cannot read or list drafts.
- This emulator was isolated test data. It does not establish matches against the production database, which remains unconfigured and untouched.
