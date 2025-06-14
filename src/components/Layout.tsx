
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/resources', label: 'Resources' },
    { path: '/shopping', label: 'Shop' },
    { path: '/community', label: 'Community' },
    { path: '/blog', label: 'News & Updates' },
    { path: '/about', label: 'About' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold gradient-text">Kids AI Resources</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}>
                  <Button 
                    variant={isActive(link.path) ? "default" : "ghost"}
                    className="relative"
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Kids AI Resources</h3>
              <p className="text-muted-foreground">
                Helping parents discover the best AI learning resources for their children.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Kids AI Resources. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
