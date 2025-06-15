
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { m } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Github, Phone, Facebook } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Register user via Supabase
    const { error } = await signUp(email, password, {
      username,
      display_name: username,
      // Add more metadata fields if needed
    });

    if (error) {
      toast.error(error.message || 'Error creating your account. Please try again.');
    } else {
      toast.success('Account created! Check your email to confirm your address.');
      navigate('/login');
    }

    setIsLoading(false);
  };

  // Real Supabase social authentication
  const handleSocialSignup = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    const { supabase } = await import('@/integrations/supabase/client');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/',
        }
      });
      if (error) {
        toast.error(`Failed to sign up with ${provider}: ${error.message}`);
      }
      // The redirect will happen if successful
    } catch (err: any) {
      toast.error(`Failed to sign up with ${provider}: ${err.message || err}`);
    }
    setIsLoading(false);
  };

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
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                  Join our community to save and review AI learning resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSocialSignup('google')}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                          fill="#FBC02D"
                        />
                        <path
                          d="M3.153 7.3455L6.4385 9.755C7.327 7.554 9.4805 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.159 2 4.828 4.1685 3.153 7.3455Z"
                          fill="#E53935"
                        />
                        <path
                          d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.001 12 18C9.399 18 7.19 16.3415 6.3585 14.027L3.0995 16.5395C4.7525 19.778 8.1135 22 12 22Z"
                          fill="#4CAF50"
                        />
                        <path
                          d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                          fill="#1565C0"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info("Facebook auth not implemented yet!")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info("Phone auth not implemented yet!")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSocialSignup('github')}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <Separator className="flex-1" />
                    <span className="mx-2 text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="johndoe"
                        required
                        disabled={isLoading}
                      />
                    </div>
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
                      <Label htmlFor="password">Password</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Sign up with Email'}
                    </Button>
                  </form>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
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

export default Signup;
