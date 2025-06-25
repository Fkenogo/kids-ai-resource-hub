
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, Palette, LineChart } from 'lucide-react';

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
const lineHeights = ['1', '1.2', '1.4', '1.5', '1.6', '1.8', '2', '2.5', '3'];
const fontFamilies = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Nunito',
  'Merriweather',
  'Playfair Display',
  'Georgia',
  'Times New Roman',
  'Arial',
  'Helvetica',
  'Verdana',
  'Courier New',
];

const textColors = [
  '#000000', '#333333', '#666666', '#999999',
  '#ff0000', '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ffa500', '#800080',
  '#008000', '#000080', '#800000', '#808000'
];

interface FontControlsProps {
  editor: Editor;
}

export const FontControls = ({ editor }: FontControlsProps) => {
  const [customFontSize, setCustomFontSize] = useState('');
  const [customLineHeight, setCustomLineHeight] = useState('');

  const handleFontSizeChange = (size: string) => {
    if (size === 'custom') return;
    editor.chain().focus().setFontSize(size).run();
  };

  const handleCustomFontSize = () => {
    if (customFontSize) {
      const size = customFontSize.includes('px') || customFontSize.includes('rem') || customFontSize.includes('em') 
        ? customFontSize 
        : `${customFontSize}px`;
      editor.chain().focus().setFontSize(size).run();
      setCustomFontSize('');
    }
  };

  const handleLineHeightChange = (lineHeight: string) => {
    if (lineHeight === 'custom') return;
    editor.chain().focus().updateAttributes('textStyle', { lineHeight }).run();
  };

  const handleCustomLineHeight = () => {
    if (customLineHeight) {
      editor.chain().focus().updateAttributes('textStyle', { lineHeight: customLineHeight }).run();
      setCustomLineHeight('');
    }
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <>
      {/* Font Size Control */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Font Size">
            <Type className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div>
              <Label>Font Size</Label>
              <Select onValueChange={handleFontSizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Custom size (e.g., 20px)"
                value={customFontSize}
                onChange={(e) => setCustomFontSize(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomFontSize()}
              />
              <Button size="sm" onClick={handleCustomFontSize}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Line Height Control */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Line Height">
            <LineChart className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div>
              <Label>Line Height</Label>
              <Select onValueChange={handleLineHeightChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select line height" />
                </SelectTrigger>
                <SelectContent>
                  {lineHeights.map((height) => (
                    <SelectItem key={height} value={height}>
                      {height}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Custom line height (e.g., 1.8)"
                value={customLineHeight}
                onChange={(e) => setCustomLineHeight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomLineHeight()}
              />
              <Button size="sm" onClick={handleCustomLineHeight}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Font Family Control */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title="Font Family">
            <Type className="h-4 w-4" />
            <span className="ml-1 text-xs">Aa</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select onValueChange={handleFontFamilyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

      {/* Text Color Control */}
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
    </>
  );
};
