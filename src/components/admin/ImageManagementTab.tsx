
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const ImageManagementTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Management</CardTitle>
        <CardDescription>
          Upload and manage images for resources. Images help make resources more engaging and easier to identify.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Image Upload Feature</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop images here or click to browse
          </p>
          <Button>
            Select Images
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
