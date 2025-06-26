
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type } from 'lucide-react';

const fontFamilies = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
  'Source Sans Pro', 'Nunito', 'Merriweather', 'Playfair Display',
  'Georgia', 'Times New Roman', 'Arial', 'Helvetica', 'Verdana', 'Courier New',
];

interface FontFamilyControlProps {
  editor: Editor;
}

export const FontFamilyControl = ({ editor }: FontFamilyControlProps) => {
  const handleFontFamilyChange = (fontFamily: string) => {
    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  return (
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
  );
};
