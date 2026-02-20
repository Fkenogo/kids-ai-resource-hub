
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { BlogGrid } from "@/components/BlogGrid";
import { Link } from "react-router-dom";
import { getBlogPosts } from '@/services/blogService';

const LatestBlogPostsSection = () => {
  const { data: posts = [] } = useQuery({
    queryKey: ['latest-blog-posts'],
    queryFn: () => getBlogPosts(false), // Only published posts
  });

  // Transform and get latest 4 posts
  const transformedPosts = posts.slice(0, 4).map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || post.content.substring(0, 150) + '...',
    content: post.content,
    author: post.profiles?.display_name || post.profiles?.username || 'Admin',
    category: post.category,
    tags: post.tags || [],
    imageUrl: post.image_url,
    datePublished: post.published_at || post.created_at,
    readTime: post.read_time || 5,
    viewCount: post.view_count || 0,
    featured: post.is_featured || false,
  }));

  if (transformedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text mb-3">Latest Articles</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest insights, tips, and trends in AI education
          </p>
        </div>
        <BlogGrid posts={transformedPosts} columns={2} />
        <div className="text-center mt-4 md:mt-6">
          <Button variant="outline" size="lg" asChild>
            <Link to="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPostsSection;
