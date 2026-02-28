
import { Button } from "@/components/ui/button";
import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AgeRangeQuickFiltersSection = () => (
  <section className="py-8 md:py-10 bg-gradient-to-br from-slate-100 via-purple-50 to-indigo-100 dark:from-purple-950/20 dark:to-indigo-950/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text mb-3">Browse by Age Group</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Find age-appropriate AI learning resources tailored for different developmental stages
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {['4-7', '8-10', '11-13', '14-17'].map((ageRange) => (
          <Link key={ageRange} to={`/resources?age=${ageRange}`} className="block">
            <m.div 
              className="enhanced-card rounded-xl p-4 md:p-6 h-full flex flex-col items-center justify-center text-center border border-white/80 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Ages {ageRange}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {ageRange === '4-7'
                  ? 'Early learning for young explorers'
                  : ageRange === '8-10'
                  ? 'Interactive tools for curious minds'
                  : ageRange === '11-13'
                  ? 'Deeper learning for middle schoolers'
                  : 'Advanced concepts for teens'
                }
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 mt-auto border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:hover:text-white"
              >
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
