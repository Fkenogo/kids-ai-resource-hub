
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { m } from 'framer-motion';
import { useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('User already authenticated, redirecting to home...');
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);
    console.log('Attempting login for:', email);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address before signing in.';
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        setIsLoading(false);
      } else if (data?.user) {
        console.log('Login successful for user:', data.user.id);
        toast.success('Login successful!');
        // Don't set loading to false here - let the auth state change handle navigation
        // The useEffect above will handle the redirect when isAuthenticated becomes true
      } else {
        console.error('Login failed: No user data received');
        toast.error('Login failed. No user data received.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      toast.error('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Show loading spinner if auth is initializing
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-panel shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl">Log in</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Log in with Email'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </m.div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
