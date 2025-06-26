
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type } from 'lucide-react';

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];

interface FontSizeControlProps {
  editor: Editor;
}

export const FontSizeControl = ({ editor }: FontSizeControlProps) => {
  const [customFontSize, setCustomFontSize] = useState('');

  const handleFontSizeChange = (size: string) => {
    if (size === 'custom') return;
    editor.chain().focus().updateAttributes('textStyle', { fontSize: size }).run();
  };

  const handleCustomFontSize = () => {
    if (customFontSize) {
      const size = customFontSize.includes('px') || customFontSize.includes('rem') || customFontSize.includes('em') 
        ? customFontSize 
        : `${customFontSize}px`;
      editor.chain().focus().updateAttributes('textStyle', { fontSize: size }).run();
      setCustomFontSize('');
    }
  };

  return (
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
  );
};
