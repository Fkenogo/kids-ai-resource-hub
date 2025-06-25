
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Table, Plus, Minus, Split, Merge } from 'lucide-react';

interface TableControlsProps {
  editor: Editor;
}

export const TableControls = ({ editor }: TableControlsProps) => {
  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" title="Table Options">
          <Table className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="space-y-2">
          <Label>Table Controls</Label>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={insertTable}
          >
            <Plus className="h-4 w-4 mr-2" />
            Insert Table
          </Button>
          
          {editor.isActive('table') && (
            <>
              <div className="border-t pt-2 space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                  Add Row Above
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                  Add Row Below
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                  Add Column Left
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                  Add Column Right
                </Button>
                
                <div className="border-t pt-1 space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-red-600"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Delete Row
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-red-600"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Delete Column
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-red-600"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Delete Table
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
