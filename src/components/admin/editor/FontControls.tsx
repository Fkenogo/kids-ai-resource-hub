
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type, Palette } from 'lucide-react';

const fonts = [
  'Inter', 'Arial', 'Georgia', 'Times New Roman', 'Helvetica', 
  'Verdana', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display'
];

const fontSizes = [
  { label: 'Small', value: '12px' },
  { label: 'Normal', value: '16px' },
  { label: 'Medium', value: '18px' },
  { label: 'Large', value: '24px' },
  { label: 'Extra Large', value: '32px' },
  { label: 'Huge', value: '48px' }
];

const colors = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF4444', '#FF6666', '#FF8888', '#FFAAAA', '#FFCCCC',
  '#00FF00', '#44FF44', '#66FF66', '#88FF88', '#AAFFAA', '#CCFFCC',
  '#0000FF', '#4444FF', '#6666FF', '#8888FF', '#AAAAFF', '#CCCCFF',
  '#FFFF00', '#FFFF44', '#FFFF66', '#FFFF88', '#FFFFAA', '#FFFFCC',
  '#FF00FF', '#FF44FF', '#FF66FF', '#FF88FF', '#FFAAFF', '#FFCCFF',
  '#00FFFF', '#44FFFF', '#66FFFF', '#88FFFF', '#AAFFFF', '#CCFFFF',
  '#FFA500', '#FFB144', '#FFBD66', '#FFC988', '#FFD5AA', '#FFE1CC',
  '#800080', '#9944BB', '#B366DD', '#CC88EE', '#DDAAFF', '#EECCFF',
  '#008000', '#44AA44', '#66BB66', '#88CC88', '#AADDAA', '#CCEECC',
  '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3', '#FFEFD5',
  '#2F4F4F', '#696969', '#708090', '#778899', '#B0C4DE', '#E6E6FA'
];

interface FontControlsProps {
  editor: Editor;
}

export const FontControls = ({ editor }: FontControlsProps) => {
  const [fontSize, setFontSize] = useState('16px');

  const applyFontSize = (size: string) => {
    setFontSize(size);
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  return (
    <>
      {/* Font Family */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Font Family">
            <Type className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <div className="grid gap-1 max-h-64 overflow-y-auto">
              {fonts.map((font) => (
                <Button
                  key={font}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8"
                  style={{ fontFamily: font }}
                  onClick={() => editor.chain().focus().setFontFamily(font).run()}
                >
                  {font}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Font Size */}
      <Select value={fontSize} onValueChange={applyFontSize}>
        <SelectTrigger className="w-24 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fontSizes.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              {size.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Text Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Text Color">
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="grid grid-cols-12 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-2">
              <Label htmlFor="custom-color">Custom Color</Label>
              <Input
                id="custom-color"
                type="color"
                className="w-full h-8"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
