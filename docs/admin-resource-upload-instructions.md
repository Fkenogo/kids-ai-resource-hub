# Admin Resource Upload Instructions

## Overview

This guide provides step-by-step instructions for uploading the 68+ AI learning resources from `kids_ai_resources.json` to your Firestore database using admin credentials.

## Why Admin Credentials Required

The Firestore security rules in this project only allow resource creation by admin users. Regular Firebase authentication cannot create resources - you need Firebase Admin SDK with service account credentials.

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

2. **Firebase Admin Credentials**: Add these additional environment variables:

   ```
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_content\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_CLIENT_X509_CERT_URL=your_cert_url
   ```

   **How to get these credentials:**
   1. Go to [Firebase Console](https://console.firebase.google.com/)
   2. Navigate to Project Settings > Service Accounts
   3. Click "Generate new private key"
   4. Copy the JSON values to your `.env` file

3. **Node.js**: Ensure you have Node.js installed (version 18 or higher recommended)

4. **Firebase Project**: Ensure your Firebase project has Firestore database set up

## Upload Process

### Method 1: Using npm script (Recommended)

1. **Open terminal** in your project root directory

2. **Run the admin upload command**:

   ```bash
   npm run upload:admin
   ```

3. **Monitor the output** - The script will:
   - Validate admin credentials
   - Check for existing resources by title to avoid duplicates
   - Upload each new resource to Firestore with admin privileges
   - Display progress with success/failure counts
   - Provide a summary at the end

### Method 2: Direct Node execution

```bash
node scripts/admin-upload-resources.mjs
```

## What the Admin Upload Script Does

### 1. **Credential Validation**

- Checks that all required admin environment variables are present
- Validates Firebase Admin SDK initialization
- Provides clear error messages if credentials are missing

### 2. **Duplicate Detection**

- Checks if a resource with the same title already exists in Firestore
- Skips existing resources to prevent duplicates
- Only uploads new resources

### 3. **Data Processing**

- Adds required Firestore fields:
  - `created_at`: Current timestamp
  - `updated_at`: Current timestamp
  - `date_added`: Current timestamp
  - Engagement metrics (view_count, like_count, etc.) set to 0
  - `featured_resource`: Based on `isFeatured` field
- Removes temporary fields (`isFeatured`, `isApproved`) that shouldn't be in Firestore

### 4. **Admin Upload Process**

- Uses Firebase Admin SDK for full database access
- Uploads each resource to the `resources` collection
- Adds a small delay (100ms) between uploads to avoid rate limiting
- Provides real-time feedback for each resource

### 5. **Error Handling**

- Catches and logs any upload errors
- Continues with remaining resources if one fails
- Provides a final summary of success/failure counts

## Expected Output

```
Checking admin credentials...
✅ Admin credentials validated
Starting bulk upload of resources to project: your_project_id...
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

1. **Missing Admin Credentials Error**

   ```
   ❌ Missing required environment variables for admin access:
      - FIREBASE_PRIVATE_KEY_ID
      - FIREBASE_PRIVATE_KEY
   ```

   **Solution**: Generate a Firebase service account key and add all required environment variables to `.env`

2. **Admin Initialization Failed**

   ```
   ❌ Admin initialization failed: Invalid argument
   ```

   **Solution**: Check that your service account JSON is properly formatted and all required fields are present

3. **Authentication Error**

   ```
   Error: Missing or insufficient permissions
   ```

   **Solution**: Ensure your service account has Firestore admin permissions

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
2. Verify your Firebase admin credentials are correctly configured
3. Ensure your service account has proper Firestore permissions
4. Check that `kids_ai_resources.json` is in the project root directory
5. Review the troubleshooting section above

The admin upload script is designed to be robust and handle most common scenarios automatically. If you follow these instructions, the upload should complete successfully with minimal manual intervention.
