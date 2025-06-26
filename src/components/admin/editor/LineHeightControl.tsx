
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart } from 'lucide-react';

const lineHeights = ['1', '1.2', '1.4', '1.5', '1.6', '1.8', '2', '2.5', '3'];

interface LineHeightControlProps {
  editor: Editor;
}

export const LineHeightControl = ({ editor }: LineHeightControlProps) => {
  const [customLineHeight, setCustomLineHeight] = useState('');

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

  return (
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
  );
};
