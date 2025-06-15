
import { Button } from "@/components/ui/button";
import { BlogGrid } from "@/components/BlogGrid";
import { Link } from "react-router-dom";

interface Props {
  featuredBlogPosts: any[];
}

const LatestBlogPostsSection = ({ featuredBlogPosts }: Props) => (
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
);

export default LatestBlogPostsSection;
