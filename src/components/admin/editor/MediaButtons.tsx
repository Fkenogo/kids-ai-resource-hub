
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Image, Link, Table, Minus } from 'lucide-react';

interface MediaButtonsProps {
  editor: Editor;
}

export const MediaButtons = ({ editor }: MediaButtonsProps) => {
  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={addImage} title="Insert Image">
        <Image className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={addLink} title="Insert Link">
        <Link className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={insertTable} title="Insert Table">
        <Table className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </>
  );
};
