
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type, Palette, LineChart } from 'lucide-react';

const fonts = [
  'Inter', 'Arial', 'Georgia', 'Times New Roman', 'Helvetica', 
  'Verdana', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Playfair Display', 'Source Sans Pro', 'Ubuntu', 'Nunito'
];

const fontSizes = [
  { label: 'Small', value: '12px' },
  { label: 'Normal', value: '16px' },
  { label: 'Medium', value: '18px' },
  { label: 'Large', value: '24px' },
  { label: 'X-Large', value: '32px' },
  { label: 'XX-Large', value: '48px' },
  { label: 'Custom', value: 'custom' }
];

const lineHeights = [
  { label: 'Tight', value: '1.2' },
  { label: 'Normal', value: '1.5' },
  { label: 'Relaxed', value: '1.75' },
  { label: 'Loose', value: '2' },
  { label: 'Extra Loose', value: '2.5' }
];

const colors = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF4444', '#FF6666', '#FF8888', '#FFAAAA', '#FFCCCC',
  '#00FF00', '#44FF44', '#66FF66', '#88FF88', '#AAFFAA', '#CCFFCC',
  '#0000FF', '#4444FF', '#6666FF', '#8888FF', '#AAAAFF', '#CCCCFF',
  '#FFFF00', '#FFFF44', '#FFFF66', '#FFFF88', '#FFFFAA', '#FFFFCC',
  '#FF00FF', '#FF44FF', '#FF66FF', '#FF88FF', '#FFAAFF', '#FFCCFF',
  '#00FFFF', '#44FFFF', '#66FFFF', '#88FFFF', '#AAFFFF', '#CCFFFF',
  '#FFA500', '#FFB144', '#FFBD66', '#FFC988', '#FFD5AA', '#FFE1CC'
];

interface FontControlsProps {
  editor: Editor;
}

export const FontControls = ({ editor }: FontControlsProps) => {
  const [fontSize, setFontSize] = useState('16px');
  const [customFontSize, setCustomFontSize] = useState('');
  const [lineHeight, setLineHeight] = useState('1.5');

  const applyFontSize = (size: string) => {
    if (size === 'custom') {
      return; // Let user input custom size
    }
    setFontSize(size);
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  const applyCustomFontSize = () => {
    if (customFontSize) {
      let sizeValue = customFontSize;
      // Add px if no unit is specified and it's a number
      if (/^\d+$/.test(customFontSize)) {
        sizeValue = customFontSize + 'px';
      }
      setFontSize(sizeValue);
      editor.chain().focus().setMark('textStyle', { fontSize: sizeValue }).run();
    }
  };

  const applyLineHeight = (height: string) => {
    setLineHeight(height);
    editor.chain().focus().setMark('textStyle', { lineHeight: height }).run();
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Font Size">
            <span className="text-xs font-mono">Aa</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-3">
            <Label>Font Size</Label>
            <Select value={fontSize} onValueChange={applyFontSize}>
              <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label>Custom Size</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="18px or 1.2rem"
                  value={customFontSize}
                  onChange={(e) => setCustomFontSize(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" onClick={applyCustomFontSize}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Line Height */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Line Height">
            <LineChart className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="space-y-2">
            <Label>Line Height</Label>
            <Select value={lineHeight} onValueChange={applyLineHeight}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lineHeights.map((height) => (
                  <SelectItem key={height.value} value={height.value}>
                    {height.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

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
