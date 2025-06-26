
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

const textColors = [
  '#000000', '#333333', '#666666', '#999999',
  '#ff0000', '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ffa500', '#800080',
  '#008000', '#000080', '#800000', '#808000'
];

interface TextColorControlProps {
  editor: Editor;
}

export const TextColorControl = ({ editor }: TextColorControlProps) => {
  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" title="Text Color">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <Label>Text Color</Label>
          <div className="grid grid-cols-8 gap-1">
            {textColors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                title={`Set color to ${color}`}
              />
            ))}
          </div>
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Remove Color
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
