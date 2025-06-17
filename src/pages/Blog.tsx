
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { BlogGrid } from '@/components/BlogGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { m } from 'framer-motion';
import { getBlogPosts } from '@/services/blogService';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts-public'],
    queryFn: () => getBlogPosts(false), // Only published posts
  });

  const categories = [...new Set(posts.map(post => post.category))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  // Transform database posts to match BlogPost interface
  const transformedPosts = filteredPosts.map(post => ({
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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <m.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              News & Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Stay updated with the latest in AI education, technology trends, and learning resources for kids.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3"
              />
            </div>
          </m.div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <m.div 
              className="flex flex-wrap justify-center gap-2 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="mb-2"
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="mb-2"
                >
                  {category}
                </Button>
              ))}
            </m.div>
          )}

          {/* Featured Posts */}
          {transformedPosts.some(post => post.featured) && (
            <m.section 
              className="mb-16"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <m.h2 
                className="text-3xl font-bold mb-8 text-center"
                variants={item}
              >
                Featured Articles
              </m.h2>
              <BlogGrid 
                posts={transformedPosts.filter(post => post.featured)} 
                columns={2}
              />
            </m.section>
          )}

          {/* All Posts */}
          <m.section
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <m.h2 
              className="text-3xl font-bold mb-8 text-center"
              variants={item}
            >
              {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
            </m.h2>
            <BlogGrid 
              posts={transformedPosts.filter(post => !post.featured || selectedCategory)} 
              columns={3} 
            />
          </m.section>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
