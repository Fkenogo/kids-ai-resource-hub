
import React from 'react';
import { Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import { FormattingButtons } from './FormattingButtons';
import { HeadingButtons } from './HeadingButtons';
import { ListButtons } from './ListButtons';
import { AlignmentButtons } from './AlignmentButtons';
import { MediaButtons } from './MediaButtons';
import { FontControls } from './FontControls';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
    <div className="border-b p-2 flex flex-wrap gap-1 items-center">
      <FontControls editor={editor} />
      
      <Separator orientation="vertical" className="h-6" />
      
      <FormattingButtons editor={editor} />
      
      <Separator orientation="vertical" className="h-6" />
      
      <HeadingButtons editor={editor} />
      
      <Separator orientation="vertical" className="h-6" />
      
      <ListButtons editor={editor} />
      
      <Separator orientation="vertical" className="h-6" />
      
      <AlignmentButtons editor={editor} />
      
      <Separator orientation="vertical" className="h-6" />
      
      <MediaButtons editor={editor} />
    </div>
  );
};
