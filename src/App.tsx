
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import About from '@/pages/About';
import ResourceDirectory from '@/pages/ResourceDirectory';
import ResourcePage from '@/pages/ResourcePage';
import Community from '@/pages/Community';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Shopping from '@/pages/Shopping';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Admin from '@/pages/Admin';
import AdminEnhanced from '@/pages/AdminEnhanced';
import AdminPlaceholderMigration from '@/pages/AdminPlaceholderMigration';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/components/auth/AuthProvider';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/index" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<ResourceDirectory />} />
              <Route path="/resources/:id" element={<ResourcePage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-enhanced" element={<AdminEnhanced />} />
              <Route path="/admin/migration" element={<AdminPlaceholderMigration />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
