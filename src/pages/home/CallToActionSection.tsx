
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToActionSection = () => (
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
);

export default CallToActionSection;
