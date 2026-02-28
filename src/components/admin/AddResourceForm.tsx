
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { createResourceAdmin } from '@/services/backend/admin';
import { toast } from 'sonner';
import { AgeRange, ResourceType, CostType } from '@/types';
import { ImageUploader } from '@/components/ImageUploader';
import { DEFAULT_FORMAT_OPTIONS, RESOURCE_TYPE_OPTIONS, formatTagsToStorage, getResourceTypeLabel } from '@/utils/resourceTaxonomy';

interface AddResourceFormProps {
  onSuccess: () => void;
}

type AddResourceFormData = {
  title: string;
  description: string;
  url: string;
  resource_type: ResourceType;
  cost: CostType;
  age_ranges: AgeRange[];
  format_tags: string[];
  learning_outcomes: string[];
  skills_attained: string[];
  key_features: string[];
  image_url: string;
};

export const AddResourceForm = ({ onSuccess }: AddResourceFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddResourceFormData>({
    title: '',
    description: '',
    url: '',
    resource_type: '' as ResourceType,
    cost: '' as CostType,
    age_ranges: [] as AgeRange[],
    format_tags: [],
    learning_outcomes: [] as string[],
    skills_attained: [] as string[],
    key_features: [] as string[],
    image_url: '',
  });

  const [newOutcome, setNewOutcome] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [resourceTypeOptions, setResourceTypeOptions] = useState<ResourceType[]>(
    RESOURCE_TYPE_OPTIONS.map((option) => option.value),
  );
  const [customResourceType, setCustomResourceType] = useState('');
  const [formatOptions, setFormatOptions] = useState<string[]>([...DEFAULT_FORMAT_OPTIONS]);
  const [customFormatTag, setCustomFormatTag] = useState('');

  const createResourceMutation = useMutation({
    mutationFn: async (data: AddResourceFormData) => {
      const { format_tags, ...rest } = data;
      await createResourceAdmin({
        ...rest,
        format: formatTagsToStorage(format_tags),
        added_by: 'admin',
      });
    },
    onSuccess: () => {
      toast.success('Resource added successfully');
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        url: '',
        resource_type: '' as ResourceType,
        cost: '' as CostType,
        age_ranges: [] as AgeRange[],
        format_tags: [],
        learning_outcomes: [],
        skills_attained: [],
        key_features: [],
        image_url: '',
      });
      onSuccess();
    },
    onError: () => {
      toast.error('Failed to add resource');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.url || !formData.resource_type || !formData.cost) {
      toast.error('Please fill in all required fields');
      return;
    }
    createResourceMutation.mutate(formData);
  };

  const addToArray = (field: 'learning_outcomes' | 'skills_attained' | 'key_features', value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field: 'learning_outcomes' | 'skills_attained' | 'key_features', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleAgeRange = (age: AgeRange) => {
    setFormData(prev => ({
      ...prev,
      age_ranges: prev.age_ranges.includes(age)
        ? prev.age_ranges.filter(a => a !== age)
        : [...prev.age_ranges, age]
    }));
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

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Resource
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Add New Resource
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Resource title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the resource..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Resource Type *</Label>
              <Select value={formData.resource_type} onValueChange={(value: ResourceType) => setFormData(prev => ({ ...prev, resource_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getResourceTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
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

            <div className="space-y-2">
              <Label>Cost *</Label>
              <Select value={formData.cost} onValueChange={(value: CostType) => setFormData(prev => ({ ...prev, cost: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cost" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <div className="flex flex-wrap gap-2">
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
              <div className="flex gap-2">
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
          </div>

          <div className="space-y-2">
            <Label>Age Ranges *</Label>
            <div className="flex flex-wrap gap-2">
              {(['4-7', '8-10', '11-13', '14-17'] as AgeRange[]).map((age) => (
                <Badge
                  key={age}
                  variant={formData.age_ranges.includes(age) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleAgeRange(age)}
                >
                  {age}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Resource Image</Label>
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              label="Upload Resource Image"
            />
          </div>

          {/* Learning Outcomes */}
          <div className="space-y-2">
            <Label>Learning Outcomes</Label>
            <div className="flex gap-2">
              <Input
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                placeholder="Add learning outcome..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('learning_outcomes', newOutcome, setNewOutcome))}
              />
              <Button type="button" onClick={() => addToArray('learning_outcomes', newOutcome, setNewOutcome)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.learning_outcomes.map((outcome, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('learning_outcomes', index)}>
                  {outcome} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills Attained */}
          <div className="space-y-2">
            <Label>Skills Attained</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('skills_attained', newSkill, setNewSkill))}
              />
              <Button type="button" onClick={() => addToArray('skills_attained', newSkill, setNewSkill)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills_attained.map((skill, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('skills_attained', index)}>
                  {skill} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <Label>Key Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('key_features', newFeature, setNewFeature))}
              />
              <Button type="button" onClick={() => addToArray('key_features', newFeature, setNewFeature)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.key_features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('key_features', index)}>
                  {feature} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createResourceMutation.isPending}>
              {createResourceMutation.isPending ? 'Adding...' : 'Add Resource'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
