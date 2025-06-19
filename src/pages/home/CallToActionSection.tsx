
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { m } from "framer-motion";

const CallToActionSection = () => (
  <section className="py-16 md:py-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white mt-16 md:mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <m.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
          Ready to explore AI with your kids?
        </h2>
        <p className="text-lg md:text-xl text-purple-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
          Join our community to discover, save, and review the best AI educational resources tailored for young minds.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link to="/signup">Create an Account</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link to="/resources">Browse Resources</Link>
          </Button>
        </div>
      </m.div>
    </div>
  </section>
);

export default CallToActionSection;
