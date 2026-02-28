# Resource Upload Instructions

## Overview

This guide provides step-by-step instructions for uploading the 68+ AI learning resources from `kids_ai_resources.json` to your Firestore database.

## Prerequisites

1. **Firebase Environment Variables**: Ensure your `.env` file contains all required Firebase configuration:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

2. **Node.js**: Ensure you have Node.js installed (version 18 or higher recommended)

3. **Firebase Project**: Ensure your Firebase project has Firestore database set up

## Upload Process

### Method 1: Using npm script (Recommended)

1. **Open terminal** in your project root directory

2. **Run the upload command**:

   ```bash
   npm run upload:resources
   ```

3. **Monitor the output** - The script will:
   - Check for existing resources by title to avoid duplicates
   - Upload each new resource to Firestore
   - Display progress with success/failure counts
   - Provide a summary at the end

### Method 2: Direct Node execution

```bash
node scripts/bulk-upload-resources.mjs
```

## What the Upload Script Does

### 1. **Duplicate Detection**

- Checks if a resource with the same title already exists in Firestore
- Skips existing resources to prevent duplicates
- Only uploads new resources

### 2. **Data Processing**

- Adds required Firestore fields:
  - `created_at`: Current timestamp
  - `updated_at`: Current timestamp
  - `date_added`: Current timestamp
  - Engagement metrics (view_count, like_count, etc.) set to 0
  - `featured_resource`: Based on `isFeatured` field
- Removes temporary fields (`isFeatured`, `isApproved`) that shouldn't be in Firestore

### 3. **Upload Process**

- Uploads each resource to the `resources` collection
- Adds a small delay (100ms) between uploads to avoid rate limiting
- Provides real-time feedback for each resource

### 4. **Error Handling**

- Catches and logs any upload errors
- Continues with remaining resources if one fails
- Provides a final summary of success/failure counts

## Expected Output

```
Starting bulk upload of 68 resources...
✅ Uploaded: Code.org AI Foundations (ID: abc123)
✅ Uploaded: Create & Learn AI Explorers (ID: def456)
Skipping existing resource: Scratch (MIT)
❌ Error uploading Resource Name: Error details...

📊 Upload Summary:
   ✅ Successfully uploaded: 65
   ❌ Failed uploads: 3
   📈 Total processed: 68

🎉 Bulk upload completed!
```

## Post-Upload Verification

### 1. **Check Firestore Console**

- Go to [Firebase Console](https://console.firebase.google.com/)
- Navigate to Firestore Database
- Verify resources appear in the `resources` collection
- Check that all fields are properly populated

### 2. **Test in Admin Dashboard**

- Access your admin dashboard
- Verify all new resources appear in the resource list
- Test filtering by age range, format, cost, etc.
- Check that featured resources are properly marked

### 3. **Test in Frontend**

- Visit your resource directory page
- Verify resources appear and are filterable
- Test search functionality
- Check that age range filters work correctly (including the new "4-7" range)

## Troubleshooting

### Common Issues

1. **Firebase Configuration Error**

   ```
   Error: Firebase configuration is invalid
   ```

   **Solution**: Check that all Firebase environment variables are correctly set in `.env`

2. **Authentication Error**

   ```
   Error: Missing or insufficient permissions
   ```

   **Solution**: Ensure your Firebase project has proper Firestore rules and you have admin access

3. **Network/Rate Limiting**

   ```
   Error: Too many requests
   ```

   **Solution**: The script includes built-in delays, but if you're still getting rate limits, you can increase the delay in the script

4. **JSON Parse Error**
   ```
   Error: Unexpected token in JSON
   ```
   **Solution**: Verify `kids_ai_resources.json` is valid JSON format

### Debug Mode

To enable more detailed logging, you can modify the script:

```javascript
// Add this at the top of the script
console.log("Debug: Resources data loaded:", resources.length, "resources");
```

## Rollback (If Needed)

If you need to remove uploaded resources:

1. **Manual Removal**: Use Firebase Console to delete resources from the `resources` collection

2. **Script-based Removal**: Create a script to delete resources by a specific criteria (e.g., created after a certain date)

## Performance Notes

- **Upload Speed**: ~10 resources per second (due to built-in delays)
- **Total Time**: ~6-7 minutes for 68 resources
- **Memory Usage**: Minimal - processes one resource at a time
- **Network Usage**: Standard Firestore API calls

## Next Steps

After successful upload:

1. **Review in Admin Dashboard**: Check for any resources that need manual adjustments
2. **Test Filtering**: Verify all filters work correctly with the new data
3. **Update Documentation**: Update any resource counts or statistics in your documentation
4. **Monitor Performance**: Check that your application performs well with the increased data

## Support

If you encounter issues:

1. Check the terminal output for specific error messages
2. Verify your Firebase configuration
3. Ensure you have proper Firestore permissions
4. Check that `kids_ai_resources.json` is in the project root directory
5. Review the troubleshooting section above

The upload script is designed to be robust and handle most common scenarios automatically. If you follow these instructions, the upload should complete successfully with minimal manual intervention.
