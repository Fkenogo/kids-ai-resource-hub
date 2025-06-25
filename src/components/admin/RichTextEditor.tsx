
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Youtube from '@tiptap/extension-youtube';
import { common, createLowlight } from 'lowlight';
import { EditorToolbar } from './editor/EditorToolbar';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, Search, RotateCcw, RotateCw } from 'lucide-react';

const lowlight = createLowlight(common);

// Enhanced LineHeight extension
const LineHeight = TextStyle.extend({
  name: 'lineHeight',
  
  addAttributes() {
    return {
      ...this.parent?.(),
      lineHeight: {
        default: null,
        parseHTML: element => {
          const lineHeight = element.style.lineHeight;
          return lineHeight || null;
        },
        renderHTML: attributes => {
          if (!attributes.lineHeight) {
            return {};
          }
          return {
            style: `line-height: ${attributes.lineHeight}`,
          };
        },
      },
    };
  },
});

// Enhanced extension for font size with better preservation
const FontSize = TextStyle.extend({
  name: 'fontSize',
  
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => {
          const fontSize = element.style.fontSize;
          return fontSize || null;
        },
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(1);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
      FontSize,
      LineHeight,
      FontFamily,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-md p-4 font-mono text-sm overflow-x-auto',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log('Editor content updated:', html);
      onChange(html);
      
      // Update word count and read time
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
      setReadTime(Math.max(1, Math.ceil(words / 200))); // 200 words per minute
    },
    editorProps: {
      attributes: {
        class: `editor-content focus:outline-none min-h-[400px] p-6 ${
          isFullscreen ? 'min-h-[calc(100vh-200px)]' : ''
        }`,
        'data-placeholder': placeholder || 'Start writing your blog post...',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <div className={`border rounded-lg ${isFullscreen ? 'fixed inset-4 z-50 bg-white shadow-2xl' : ''}`}>
      <EditorToolbar editor={editor} />
      
      {/* Editor Actions Bar */}
      <div className="border-b p-2 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFormatting}
            title="Clear Formatting"
          >
            Clear Format
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{wordCount} words</span>
          <span>{readTime} min read</span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={`${isFullscreen ? 'flex-1 overflow-auto' : ''}`}>
        <EditorContent 
          editor={editor}
          className="editor-wrapper"
        />
      </div>
    </div>
  );
};
