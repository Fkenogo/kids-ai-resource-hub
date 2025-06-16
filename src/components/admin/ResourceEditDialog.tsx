
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/ImageUploader';

interface ResourceEditDialogProps {
  resource: any;
  onUpdated: () => void;
}

const ageRangeOptions = ['5-7', '8-10', '11-13', '14-17'];
const resourceTypeOptions = [
  'online_course', 'book', 'interactive_tool', 'game', 'video', 
  'tutorial', 'activity', 'camp', 'ai_tool', 'curriculum'
];
const costOptions = ['free', 'paid', 'subscription', 'freemium'];

export const ResourceEditDialog = ({ resource, onUpdated }: ResourceEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: resource.title || '',
    description: resource.description || '',
    url: resource.url || '',
    age_ranges: resource.age_ranges || [],
    resource_type: resource.resource_type || '',
    cost: resource.cost || '',
    format: resource.format || '',
    learning_outcomes: resource.learning_outcomes || [],
    skills_attained: resource.skills_attained || [],
    key_features: resource.key_features || [],
    image_url: resource.image_url || '',
  });

  const queryClient = useQueryClient();

  const updateResourceMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await supabase
        .from('resources')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', resource.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast.success('Resource updated successfully');
      setOpen(false);
      onUpdated();
    },
    onError: () => {
      toast.error('Failed to update resource');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateResourceMutation.mutate(formData);
  };

  const handleArrayFieldChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const toggleAgeRange = (ageRange: string) => {
    setFormData(prev => ({
      ...prev,
      age_ranges: prev.age_ranges.includes(ageRange)
        ? prev.age_ranges.filter(range => range !== ageRange)
        : [...prev.age_ranges, ageRange]
    }));
  };

  const arrayFieldToString = (field: string[]) => field?.join(', ') || '';

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>
            Update the resource information below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">URL *</label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Resource Image</label>
              <ImageUploader
                value={formData.image_url}
                onChange={handleImageUpload}
                label="Upload Resource Image"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Resource Type *</label>
                <Select 
                  value={formData.resource_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, resource_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Cost *</label>
                <Select 
                  value={formData.cost} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cost: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cost" />
                  </SelectTrigger>
                  <SelectContent>
                    {costOptions.map(cost => (
                      <SelectItem key={cost} value={cost}>
                        {cost.charAt(0).toUpperCase() + cost.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Format</label>
              <Input
                value={formData.format}
                onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                placeholder="e.g., Video, Interactive Tool, Course"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Age Ranges *</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {ageRangeOptions.map(range => (
                  <Badge
                    key={range}
                    variant={formData.age_ranges.includes(range) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAgeRange(range)}
                  >
                    {formData.age_ranges.includes(range) && <X className="h-3 w-3 mr-1" />}
                    {range}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Learning Outcomes</label>
              <Textarea
                value={arrayFieldToString(formData.learning_outcomes)}
                onChange={(e) => handleArrayFieldChange('learning_outcomes', e.target.value)}
                placeholder="Separate multiple outcomes with commas"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Skills Attained</label>
              <Textarea
                value={arrayFieldToString(formData.skills_attained)}
                onChange={(e) => handleArrayFieldChange('skills_attained', e.target.value)}
                placeholder="Separate multiple skills with commas"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Key Features</label>
              <Textarea
                value={arrayFieldToString(formData.key_features)}
                onChange={(e) => handleArrayFieldChange('key_features', e.target.value)}
                placeholder="Separate multiple features with commas"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateResourceMutation.isPending}>
              {updateResourceMutation.isPending ? 'Updating...' : 'Update Resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
