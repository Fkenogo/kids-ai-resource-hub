
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ResourceGrid } from '@/components/ResourceGrid';
import { BlogGrid } from '@/components/BlogGrid';
import { Button } from '@/components/ui/button';
import { getRecentResources, getTopRatedResources, getFeaturedResources } from '@/data/mockData';
import { getFeaturedBlogPosts } from '@/data/blogData';
import { Badge } from '@/components/ui/badge';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const featuredResources = getFeaturedResources(3);
  const recentResources = getRecentResources(6);
  const topRatedResources = getTopRatedResources(6);
  const featuredBlogPosts = getFeaturedBlogPosts(2);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <m.div 
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <m.div variants={fadeInUp}>
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 text-sm py-1 px-3">
                Educational Resources
              </Badge>
            </m.div>
            
            <m.h1 
              className="text-4xl sm:text-5xl md:text-display font-bold leading-tight mb-6"
              variants={fadeInUp}
            >
              Discover the best <span className="gradient-text">AI learning resources</span> for your children
            </m.h1>
            
            <m.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl"
              variants={fadeInUp}
            >
              A curated directory of educational tools, courses, games, and materials to help kids learn about artificial intelligence.
            </m.p>
            
            <m.div 
              className="flex flex-wrap gap-4"
              variants={fadeInUp}
            >
              <Button size="lg" asChild>
                <Link to="/resources">Explore Resources</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="bg-secondary/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Featured Resources</h2>
          </div>
          <ResourceGrid resources={featuredResources} columns={3} />
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Latest Articles</h2>
            <Button variant="outline" asChild>
              <Link to="/blog">View All</Link>
            </Button>
          </div>
          <BlogGrid posts={featuredBlogPosts} columns={2} />
        </div>
      </section>

      {/* Age Range Quick Filters */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">Browse by Age Group</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['5-7', '8-10', '11-13', '14-17'].map((ageRange) => (
              <Link 
                key={ageRange} 
                to={`/resources?age=${ageRange}`}
                className="block"
              >
                <m.div 
                  className="glass-panel rounded-xl p-6 h-full flex flex-col items-center justify-center text-center shadow-soft hover:shadow-medium transition-all duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <h3 className="text-xl font-medium mb-2">Ages {ageRange}</h3>
                  <p className="text-muted-foreground mb-4">
                    {ageRange === '5-7'
                      ? 'Early learning resources for young explorers'
                      : ageRange === '8-10'
                      ? 'Interactive tools for curious minds'
                      : ageRange === '11-13'
                      ? 'Deeper learning for middle schoolers'
                      : 'Advanced concepts for teens'
                    }
                  </p>
                  <Button variant="outline" size="sm" className="gap-1 mt-auto">
                    Explore <ArrowRight className="h-4 w-4" />
                  </Button>
                </m.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Resources */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Recently Added</h2>
            <Button variant="outline" asChild>
              <Link to="/resources">View All</Link>
            </Button>
          </div>
          <ResourceGrid resources={recentResources} columns={3} />
        </div>
      </section>

      {/* Top Rated Resources */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Top Rated</h2>
            <Button variant="outline" asChild>
              <Link to="/resources">View All</Link>
            </Button>
          </div>
          <ResourceGrid resources={topRatedResources} columns={3} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to explore AI with your kids?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community to discover, save, and review the best AI educational resources.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">Create an Account</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/resources">Browse Resources</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
