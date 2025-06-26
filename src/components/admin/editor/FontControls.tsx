
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSizeControl } from './FontSizeControl';
import { LineHeightControl } from './LineHeightControl';
import { FontFamilyControl } from './FontFamilyControl';
import { TextColorControl } from './TextColorControl';

interface FontControlsProps {
  editor: Editor;
}

export const FontControls = ({ editor }: FontControlsProps) => {
  return (
    <>
      <FontSizeControl editor={editor} />
      <LineHeightControl editor={editor} />
      <FontFamilyControl editor={editor} />
      <TextColorControl editor={editor} />
    </>
  );
};
