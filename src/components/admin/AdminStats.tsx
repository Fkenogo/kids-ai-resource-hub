
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Star, Eye, TrendingUp } from 'lucide-react';
import { Resource } from '@/types';

interface AdminStatsProps {
  resources: Resource[];
}

export const AdminStats = ({ resources }: AdminStatsProps) => {
  const stats = {
    totalResources: resources.length,
    approvedResources: resources.filter((r: Resource) => r.featuredResource).length,
    totalViews: resources.reduce((sum: number, r: Resource) => sum + (r.viewCount || 0), 0),
    avgRating: resources.length > 0 ? 
      (resources.reduce((sum: number, r: Resource) => sum + r.averageRating, 0) / resources.length).toFixed(1) : 
      '0.0'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalResources}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Featured Resources</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approvedResources}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgRating}/5.0</div>
        </CardContent>
      </Card>
    </div>
  );
};
