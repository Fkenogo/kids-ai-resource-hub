
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, Maximize, Minimize } from 'lucide-react';

interface EditorActionsProps {
  editor: Editor;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const EditorActions = ({ editor, isFullscreen, onToggleFullscreen }: EditorActionsProps) => {
  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
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
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleFullscreen}
        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>
    </div>
  );
};
