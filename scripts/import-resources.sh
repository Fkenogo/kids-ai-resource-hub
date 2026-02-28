#!/bin/bash
# Firebase Import Script using CLI
# This script uses firebase firestore:import

echo "Firebase Resources Import Script"
echo "================================"

# Check if logged in
echo "Checking Firebase login..."
npx firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Not logged in to Firebase. Please run:"
    echo "  npx firebase login"
    exit 1
fi

echo "You are logged in to Firebase."

# Create a temporary file for import
echo "Preparing import data..."

# The import requires a specific format
# Let's use the kids_ai_resources.json and convert it

cat > /tmp/resources_import.json << 'HEREDOC'
{
  "collections": []
}
HEREDOC

echo ""
echo "======================================"
echo "INSTRUCTIONS TO IMPORT DATA:"
echo "======================================"
echo ""
echo "Option 1 - Quick Import (Recommended):"
echo "1. Go to: https://console.firebase.google.com/project/kids-ai-resources/firestore"
echo "2. Click 'Start collection'"
echo "3. Enter 'resources' as the collection ID"
echo "4. Click 'Add document'"
echo "5. Use auto-ID"
echo "6. Add fields from kids_ai_resources.json"
echo ""
echo "Option 2 - Using gcloud (requires setup):"
echo "1. Run: gcloud auth application-default login"
echo "2. Then run: npm run upload:admin-sdk"
echo ""
echo "Option 3 - Using the app's admin interface:"
echo "1. Start the app: npm run dev"
echo "2. Login as admin"
echo "3. Go to /admin"
echo "4. Use 'Add Resource' to add resources manually"
echo ""
echo "======================================"

# Try to open Firebase Console
echo "Opening Firebase Console..."
open "https://console.firebase.google.com/project/kids-ai-resources/firestore/data"

