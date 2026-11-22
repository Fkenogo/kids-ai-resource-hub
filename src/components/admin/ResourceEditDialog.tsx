
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, X } from 'lucide-react';
import { updateResourceAdmin } from '@/services/backend/admin';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/ImageUploader';
import { CostType, ResourceType } from '@/types';
import { DEFAULT_FORMAT_OPTIONS, RESOURCE_TYPE_OPTIONS, formatTagsToStorage, getResourceTypeLabel, normalizeResourceType, parseFormatTags } from '@/utils/resourceTaxonomy';
import { toggleSupportedAgeRange } from '@/services/resourceImportService';

interface ResourceEditDialogProps {
  resource: {
    id: string;
    title?: string;
    description?: string;
    url?: string;
    age_ranges?: string[];
    resource_type?: string;
    cost?: string;
    format?: string;
    learning_outcomes?: string[];
    skills_attained?: string[];
    key_features?: string[];
    image_url?: string;
    is_approved?: boolean;
    source_id?: string;
  };
  onUpdated: () => void;
}

type ResourceEditFormData = {
  title: string;
  description: string;
  url: string;
  age_ranges: string[];
  resource_type: string;
  cost: string;
  format_tags: string[];
  learning_outcomes: string[];
  skills_attained: string[];
  key_features: string[];
  image_url: string;
};

const ageRangeOptions = ['4-7', '8-10', '11-13', '14-17'];
const costOptions = ['free', 'paid', 'subscription', 'freemium'];

export const ResourceEditDialog = ({ resource, onUpdated }: ResourceEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ResourceEditFormData>({
    title: resource.title || '',
    description: resource.description || '',
    url: resource.url || '',
    age_ranges: resource.age_ranges || [],
    resource_type: normalizeResourceType(resource.resource_type || ''),
    cost: resource.cost || '',
    format_tags: parseFormatTags(resource.format || ''),
    learning_outcomes: resource.learning_outcomes || [],
    skills_attained: resource.skills_attained || [],
    key_features: resource.key_features || [],
    image_url: resource.image_url || '',
  });
  const [resourceTypeOptions, setResourceTypeOptions] = useState<ResourceType[]>(
    Array.from(new Set([...RESOURCE_TYPE_OPTIONS.map((option) => option.value), formData.resource_type as ResourceType].filter(Boolean))),
  );
  const [customResourceType, setCustomResourceType] = useState('');
  const [formatOptions, setFormatOptions] = useState<string[]>(
    Array.from(new Set([...DEFAULT_FORMAT_OPTIONS, ...formData.format_tags])),
  );
  const [customFormatTag, setCustomFormatTag] = useState('');

  const queryClient = useQueryClient();

  const updateResourceMutation = useMutation({
    mutationFn: async (updates: ResourceEditFormData) => {
      const { format_tags, ...rest } = updates;
      await updateResourceAdmin(resource.id, {
        ...rest,
        format: formatTagsToStorage(format_tags),
      });
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
    setFormData(prev => ({ ...prev, age_ranges: toggleSupportedAgeRange(prev.age_ranges, ageRange) }));
  };

  const removeUnsupportedAgeRange = (ageRange: string) => {
    setFormData((prev) => ({ ...prev, age_ranges: prev.age_ranges.filter((range) => range !== ageRange) }));
  };

  const addCustomResourceType = () => {
    const value = customResourceType.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (!value) return;
    if (!resourceTypeOptions.includes(value)) {
      setResourceTypeOptions((prev) => [...prev, value]);
    }
    setFormData((prev) => ({ ...prev, resource_type: value }));
    setCustomResourceType('');
  };

  const toggleFormatTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      format_tags: prev.format_tags.includes(tag)
        ? prev.format_tags.filter((currentTag) => currentTag !== tag)
        : [...prev.format_tags, tag],
    }));
  };

  const addCustomFormatTag = () => {
    const value = customFormatTag.trim();
    if (!value) return;
    if (!formatOptions.includes(value)) {
      setFormatOptions((prev) => [...prev, value]);
    }
    setFormData((prev) => ({
      ...prev,
      format_tags: prev.format_tags.includes(value)
        ? prev.format_tags
        : [...prev.format_tags, value],
    }));
    setCustomFormatTag('');
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
            {resource.is_approved === false
              ? 'Edit and save this unpublished draft. Saving will not publish it.'
              : 'Update the resource information below.'}
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
              <label className="text-sm font-medium">URL{resource.is_approved === false ? '' : ' *'}</label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required={resource.is_approved !== false}
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
                  onValueChange={(value) => setFormData(prev => ({ ...prev, resource_type: value as ResourceType }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>
                        {getResourceTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={customResourceType}
                    onChange={(e) => setCustomResourceType(e.target.value)}
                    placeholder="Add custom resource type"
                  />
                  <Button type="button" variant="outline" onClick={addCustomResourceType}>
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Cost *</label>
                <Select
                  value={formData.cost} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cost: value as CostType }))}
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
                    {formData.cost && !costOptions.includes(formData.cost) ? (
                      <SelectItem value={formData.cost}>{formData.cost}</SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Format</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {formatOptions.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formData.format_tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFormatTag(tag)}
                  >
                    {formData.format_tags.includes(tag) ? <X className="h-3 w-3 mr-1" /> : null}
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  value={customFormatTag}
                  onChange={(e) => setCustomFormatTag(e.target.value)}
                  placeholder="Add custom format tag"
                />
                <Button type="button" variant="outline" onClick={addCustomFormatTag}>
                  Add
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Age Ranges *</label>
              {formData.age_ranges.some((range) => !ageRangeOptions.includes(range)) && (
                <div className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
                  <p className="mb-2 text-xs text-amber-800">Imported age ranges need correction. Select a supported range to replace them, or remove an unsupported value. Original source data is preserved.</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.age_ranges.filter((range) => !ageRangeOptions.includes(range)).map((range) => (
                      <button
                        key={range}
                        type="button"
                        className="inline-flex cursor-pointer items-center rounded-full border border-transparent bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground transition-colors hover:bg-destructive/80"
                        aria-label={`Remove unsupported age range ${range}`}
                        onClick={() => removeUnsupportedAgeRange(range)}
                      >
                        <X className="mr-1 h-3 w-3" />{range}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
