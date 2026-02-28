
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Database } from 'lucide-react';
import { toast } from 'sonner';
import { AgeRange, ResourceType, CostType } from '@/types';

export const SQLTemplateGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    resource_type: '' as ResourceType,
    cost: '' as CostType,
    age_ranges: [] as AgeRange[],
    format: '',
    learning_outcomes: '',
    skills_attained: '',
    key_features: '',
    image_url: '',
  });

  const generateSQL = () => {
    if (!formData.title || !formData.description || !formData.url || !formData.resource_type || !formData.cost) {
      toast.error('Please fill in at least title, description, URL, resource type, and cost');
      return '';
    }

    const learningOutcomes = formData.learning_outcomes
      ? `ARRAY[${formData.learning_outcomes.split(',').map(item => `'${item.trim()}'`).join(', ')}]`
      : 'NULL';

    const skillsAttained = formData.skills_attained
      ? `ARRAY[${formData.skills_attained.split(',').map(item => `'${item.trim()}'`).join(', ')}]`
      : 'NULL';

    const keyFeatures = formData.key_features
      ? `ARRAY[${formData.key_features.split(',').map(item => `'${item.trim()}'`).join(', ')}]`
      : 'NULL';

    const ageRanges = formData.age_ranges.length > 0
      ? `ARRAY[${formData.age_ranges.map(age => `'${age}'`).join(', ')}]`
      : `ARRAY['4-7', '8-10', '11-13', '14-17']`;

    return `INSERT INTO public.resources (
  title,
  description,
  url,
  resource_type,
  cost,
  age_ranges,
  format,
  learning_outcomes,
  skills_attained,
  key_features,
  image_url,
  added_by,
  is_approved,
  is_featured
) VALUES (
  '${formData.title.replace(/'/g, "''")}',
  '${formData.description.replace(/'/g, "''")}',
  '${formData.url}',
  '${formData.resource_type}',
  '${formData.cost}',
  ${ageRanges},
  ${formData.format ? `'${formData.format.replace(/'/g, "''")}'` : 'NULL'},
  ${learningOutcomes},
  ${skillsAttained},
  ${keyFeatures},
  ${formData.image_url ? `'${formData.image_url}'` : 'NULL'},
  'admin',
  true,
  false
);`;
  };

  const copySQL = () => {
    const sql = generateSQL();
    if (sql) {
      navigator.clipboard.writeText(sql);
      toast.success('SQL copied to clipboard');
    }
  };

  const toggleAgeRange = (age: AgeRange) => {
    setFormData(prev => ({
      ...prev,
      age_ranges: prev.age_ranges.includes(age)
        ? prev.age_ranges.filter(a => a !== age)
        : [...prev.age_ranges, age]
    }));
  };

  const sql = generateSQL();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          SQL Template Generator
        </CardTitle>
        <CardDescription>
          Generate SQL INSERT statements for quick resource additions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sql-title">Title *</Label>
            <Input
              id="sql-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Resource title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sql-url">URL *</Label>
            <Input
              id="sql-url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sql-description">Description *</Label>
          <Textarea
            id="sql-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Resource description"
            rows={2}
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
                <SelectItem value="online_course">Online Course</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="interactive_tool">Interactive Tool</SelectItem>
                <SelectItem value="game">Game</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="camp">Camp</SelectItem>
                <SelectItem value="ai_tool">AI Tool</SelectItem>
                <SelectItem value="curriculum">Curriculum</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="sql-format">Format</Label>
            <Input
              id="sql-format"
              value={formData.format}
              onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
              placeholder="e.g., Video, Interactive"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Age Ranges (leave empty for all ages)</Label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sql-outcomes">Learning Outcomes (comma-separated)</Label>
            <Textarea
              id="sql-outcomes"
              value={formData.learning_outcomes}
              onChange={(e) => setFormData(prev => ({ ...prev, learning_outcomes: e.target.value }))}
              placeholder="Learn programming, Build projects, etc."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sql-skills">Skills Attained (comma-separated)</Label>
            <Textarea
              id="sql-skills"
              value={formData.skills_attained}
              onChange={(e) => setFormData(prev => ({ ...prev, skills_attained: e.target.value }))}
              placeholder="Python, JavaScript, etc."
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sql-features">Key Features (comma-separated)</Label>
          <Textarea
            id="sql-features"
            value={formData.key_features}
            onChange={(e) => setFormData(prev => ({ ...prev, key_features: e.target.value }))}
            placeholder="Interactive lessons, Progress tracking, etc."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sql-image">Image URL</Label>
          <Input
            id="sql-image"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {sql && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated SQL</Label>
              <Button onClick={copySQL} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy SQL
              </Button>
            </div>
            <Textarea
              value={sql}
              readOnly
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              Copy this SQL and run it in your Supabase SQL editor to add the resource.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
