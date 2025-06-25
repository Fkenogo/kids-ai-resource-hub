
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Highlighter } from 'lucide-react';

const highlightColors = [
  '#ffff00', '#00ff00', '#00ffff', '#ff00ff', 
  '#ffa500', '#ff6b6b', '#4ecdc4', '#45b7d1',
  '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'
];

interface HighlightControlsProps {
  editor: Editor;
}

export const HighlightControls = ({ editor }: HighlightControlsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant={editor.isActive('highlight') ? 'default' : 'ghost'} 
          size="sm" 
          title="Highlight Text"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <Label>Highlight Color</Label>
          <div className="grid grid-cols-6 gap-1">
            {highlightColors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                title={`Highlight with ${color}`}
              />
            ))}
          </div>
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              Remove Highlight
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
