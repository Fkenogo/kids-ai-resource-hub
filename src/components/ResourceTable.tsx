
import { Resource } from '@/types';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ResourceTableProps {
  resources: Resource[];
}

export const ResourceTable = ({ resources }: ResourceTableProps) => {
  const formatList = (items: string[] | undefined) => {
    if (!items || items.length === 0) return '-';
    return items.join(', ');
  };

  return (
    <div className="w-full overflow-auto">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Key Features</TableHead>
            <TableHead>Learning Outcomes</TableHead>
            <TableHead>Skills Gained</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell className="font-medium">
                <Link 
                  to={`/resources/${resource.id}`}
                  className="hover:underline text-primary"
                >
                  {resource.title}
                </Link>
                <div className="flex gap-1 mt-1">
                  {resource.ageRanges.map(age => (
                    <Badge key={age} variant="outline" className="text-xs">
                      {age}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{resource.format || getFormatFromType(resource.resourceType)}</TableCell>
              <TableCell className="max-w-xs">
                <div className="line-clamp-2">{resource.description}</div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="line-clamp-2">{formatList(resource.keyFeatures)}</div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="line-clamp-2">{formatList(resource.learningOutcomes)}</div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="line-clamp-2">{formatList(resource.skillsAttained)}</div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={resource.cost === 'free' ? 'success' : 'default'}
                  className="capitalize"
                >
                  {resource.cost}
                </Badge>
              </TableCell>
              <TableCell>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  Visit
                  <ExternalLink size={14} />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

function getFormatFromType(type: string): string {
  const formatMap: Record<string, string> = {
    'online_courses_platforms': 'Online Course',
    'book': 'Book',
    'books_reading_materials': 'Book',
    'interactive_tool': 'Interactive Tool',
    'interactive_tools_apps': 'Interactive Tool',
    'game': 'Game',
    'ai_powered_games_simulations': 'Game',
    'video': 'Video',
    'youtube_channels_video_resources': 'Video',
    'tutorial': 'Tutorial',
    'activity': 'Activity',
    'hands_on_ai_projects_activities': 'Activity',
    'camp': 'Camp',
    'ai_camps_webinars_live_classes': 'Camp',
    'online_course': 'Online Course',
    'ai_tool': 'AI Tool',
    'curriculum': 'Curriculum'
  };
  
  return formatMap[type] || type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
