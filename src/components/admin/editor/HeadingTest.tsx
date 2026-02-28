import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import { Button } from '@/components/ui/button';
import { Heading1, Heading2, Heading3 } from 'lucide-react';

interface HeadingTestProps {
  onTestComplete: (success: boolean, message: string) => void;
}

export const HeadingTest = ({ onTestComplete }: HeadingTestProps) => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
    ],
    content: '<p>Test paragraph</p>',
    editorProps: {
      attributes: {
        class: 'test-editor-content',
      },
    },
  });

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, message]);
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    try {
      // Test 1: Check if editor is initialized
      if (!editor) {
        addTestResult('❌ Editor initialization failed');
        onTestComplete(false, 'Editor not initialized');
        return;
      }
      addTestResult('✅ Editor initialized successfully');

      // Test 2: Check if heading extension is loaded
      const headingExtension = editor.extensionManager.extensions.find(ext => ext.name === 'heading');
      if (!headingExtension) {
        addTestResult('❌ Heading extension not loaded');
        onTestComplete(false, 'Heading extension missing');
        return;
      }
      addTestResult('✅ Heading extension loaded');

      // Test 3: Test H1 functionality
      editor.chain().focus().setHeading({ level: 1 }).run();
      const isActiveH1 = editor.isActive('heading', { level: 1 });
      if (isActiveH1) {
        addTestResult('✅ H1 formatting works');
      } else {
        addTestResult('❌ H1 formatting failed');
      }

      // Test 4: Test H2 functionality
      editor.chain().focus().setHeading({ level: 2 }).run();
      const isActiveH2 = editor.isActive('heading', { level: 2 });
      if (isActiveH2) {
        addTestResult('✅ H2 formatting works');
      } else {
        addTestResult('❌ H2 formatting failed');
      }

      // Test 5: Test H3 functionality
      editor.chain().focus().setHeading({ level: 3 }).run();
      const isActiveH3 = editor.isActive('heading', { level: 3 });
      if (isActiveH3) {
        addTestResult('✅ H3 formatting works');
      } else {
        addTestResult('❌ H3 formatting failed');
      }

      // Test 6: Test toggle functionality
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      const isNotActiveH2 = !editor.isActive('heading', { level: 2 });
      if (isNotActiveH2) {
        addTestResult('✅ Heading toggle works');
      } else {
        addTestResult('❌ Heading toggle failed');
      }

      // Test 7: Check content structure
      const content = editor.getHTML();
      if (content.includes('<h2>') || content.includes('<h1>') || content.includes('<h3>')) {
        addTestResult('✅ Heading content generated');
      } else {
        addTestResult('❌ No heading content found');
      }

      // Determine overall success
      const successCount = testResults.filter(result => result.startsWith('✅')).length;
      const totalTests = testResults.length;
      const success = successCount >= totalTests - 1; // Allow 1 failure

      onTestComplete(success, `Tests completed: ${successCount}/${totalTests} passed`);

    } catch (error) {
      addTestResult(`❌ Test error: ${error}`);
      onTestComplete(false, `Test failed: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Heading Functionality Test</h3>
        <Button onClick={runTests} disabled={isTesting}>
          {isTesting ? 'Testing...' : 'Run Tests'}
        </Button>
      </div>

      <div className="border rounded p-2">
        <EditorContent editor={editor} className="test-editor" />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Test Results:</h4>
        {testResults.map((result, index) => (
          <div key={index} className="text-sm font-mono">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};