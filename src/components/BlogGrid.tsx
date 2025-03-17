
import { BlogPost } from '@/types';
import { BlogCard } from '@/components/BlogCard';
import { motion } from 'framer-motion';

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

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // If no posts, show a message
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className={`grid ${gridCols[columns]} gap-8`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post, index) => (
        <motion.div key={post.id} variants={item}>
          <BlogCard post={post} compact={compact} />
        </motion.div>
      ))}
    </motion.div>
  );
};
