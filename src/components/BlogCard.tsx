
import { BlogPost } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
  compact?: boolean;
}

export const BlogCard = ({ post, compact = false }: BlogCardProps) => {
  const publishedDate = new Date(post.datePublished);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {!compact && post.imageUrl && (
            <div className="h-48 overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          <CardHeader className={compact ? "p-4" : ""}>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                {post.category}
              </Badge>
            </div>
            <CardTitle className={`line-clamp-2 ${compact ? "text-lg" : "text-2xl"}`}>
              {post.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>{timeAgo}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className={compact ? "p-4 pt-0" : ""}>
            <p className={`text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
              {post.excerpt}
            </p>
          </CardContent>
          <CardFooter className={compact ? "p-4 pt-0" : ""}>
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{post.viewCount.toLocaleString()} views</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </m.div>
  );
};
