import React from 'react';
import { EnhancedRichTextEditor } from '@/components/admin/editor/EnhancedRichTextEditor';
import { HeadingTest } from '@/components/admin/editor/HeadingTest';

export const AdminTest = () => {
  const [content, setContent] = React.useState('<p>Test your blog editor here. Try using H1, H2, H3 headings and other formatting options.</p>');

  const handleTestComplete = (success: boolean, message: string) => {
    console.log('Test completed:', success, message);
    if (success) {
      alert('✅ All tests passed! Heading functionality is working correctly.');
    } else {
      alert('❌ Tests failed: ' + message);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Admin Editor Test Page</h1>
        <p className="text-muted-foreground">
          This page allows you to test the blog editor functionality, particularly the heading features (H1, H2, H3).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Enhanced Rich Text Editor</h2>
          <EnhancedRichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Test the editor with headings, formatting, and other features..."
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Current Content:</h3>
            <div className="bg-white p-4 rounded border">
              <pre className="text-sm overflow-auto">{content}</pre>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Heading Functionality Test</h2>
          <HeadingTest onTestComplete={handleTestComplete} />
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Test Instructions:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Click "Run Tests" to verify heading functionality</li>
              <li>Try using H1, H2, H3 buttons in the editor above</li>
              <li>Check that headings appear correctly in the content</li>
              <li>Verify toggle functionality works properly</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">H1 Headings</h3>
          <p className="text-sm text-blue-700">
            Use the H1 button to create main section headings. These should appear as large, bold text.
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">H2 Headings</h3>
          <p className="text-sm text-green-700">
            Use the H2 button for subsection headings. These should be slightly smaller than H1.
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">H3 Headings</h3>
          <p className="text-sm text-purple-700">
            Use the H3 button for sub-subsection headings. These should be smaller than H2.
          </p>
        </div>
      </div>
    </div>
  );
};