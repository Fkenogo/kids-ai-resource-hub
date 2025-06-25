
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Indent, Outdent } from 'lucide-react';

interface IndentControlsProps {
  editor: Editor;
}

export const IndentControls = ({ editor }: IndentControlsProps) => {
  const handleIndent = () => {
    if (editor.isActive('listItem')) {
      editor.chain().focus().sinkListItem('listItem').run();
    } else {
      // For non-list items, we can add margin or padding
      editor.chain().focus().updateAttributes('paragraph', {
        style: 'margin-left: 2rem;'
      }).run();
    }
  };

  const handleOutdent = () => {
    if (editor.isActive('listItem')) {
      editor.chain().focus().liftListItem('listItem').run();
    } else {
      // Remove indentation
      editor.chain().focus().updateAttributes('paragraph', {
        style: null
      }).run();
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOutdent}
        title="Decrease Indent"
      >
        <Outdent className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleIndent}
        title="Increase Indent"
      >
        <Indent className="h-4 w-4" />
      </Button>
    </>
  );
};
