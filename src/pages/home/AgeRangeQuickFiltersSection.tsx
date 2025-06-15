
import { Button } from "@/components/ui/button";
import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AgeRangeQuickFiltersSection = () => (
  <section className="py-16 bg-secondary/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8">Browse by Age Group</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['5-7', '8-10', '11-13', '14-17'].map((ageRange) => (
          <Link key={ageRange} to={`/resources?age=${ageRange}`} className="block">
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
);

export default AgeRangeQuickFiltersSection;
