
import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
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
  );
};

export default HeroSection;
