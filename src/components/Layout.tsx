
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { m } from 'framer-motion';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { LogOut, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { isAuthenticated, signOut, user } = useAuthContext();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleSignOut = async () => {
    await signOut();
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
              <Link to="/" className="flex items-center space-x-4">
                <img 
                  src="/lovable-uploads/b06fc25d-6372-4cd6-ade8-3fc94c11b0b9.png" 
                  alt="Kids AI Resources Icon" 
                  className="h-12 w-12"
                />
                <div className="hidden sm:block">
                  <div className="text-xl font-bold brand-gradient-text">Kids AI Resources</div>
                  <div className="text-xs text-brand-secondary">Helping Parents Teach AI</div>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}>
                  <Button 
                    variant={isActive(link.path) ? "default" : "ghost"}
                    className="relative hover:bg-brand-purple/10 hover:text-brand-purple transition-colors"
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <m.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gradient"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 border-brand-purple/20 hover:bg-brand-purple/5">
                      <User className="h-4 w-4 text-brand-purple" />
                      <span className="text-brand-purple">{user?.email?.split('@')[0] || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" asChild className="border-brand-purple/20 hover:bg-brand-purple/5 text-brand-purple">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-brand-gradient hover:opacity-90 text-white">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
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
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/b06fc25d-6372-4cd6-ade8-3fc94c11b0b9.png" 
                  alt="Kids AI Resources Icon" 
                  className="h-10 w-10"
                />
                <h3 className="text-lg font-semibold brand-gradient-text">Kids AI Resources</h3>
              </div>
              <p className="text-muted-foreground">
                Helping parents discover the best AI learning resources for their children.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-brand-purple">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground hover:text-brand-purple transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-brand-purple">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-brand-purple transition-colors">
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
