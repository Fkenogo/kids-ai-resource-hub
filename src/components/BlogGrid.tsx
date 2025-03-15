
import { BlogPost } from '@/types';
import { BlogCard } from '@/components/BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
  columns?: 1 | 2 | 3 | 4;
  compact?: boolean;
}

export const BlogGrid = ({ posts, columns = 3, compact = false }: BlogGridProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} compact={compact} />
      ))}
    </div>
  );
};
