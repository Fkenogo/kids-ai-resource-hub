import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const ResourceDirectory = lazy(() => import("./pages/ResourceDirectory"));
const ResourcePage = lazy(() => import("./pages/ResourcePage"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Community = lazy(() => import("./pages/Community"));
const Shopping = lazy(() => import("./pages/Shopping"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminPlaceholderMigration = lazy(() => import("./pages/AdminPlaceholderMigration"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LazyMotion strict features={domAnimation}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/resources" element={<ResourceDirectory />} />
                  <Route path="/resources/:id" element={<ResourcePage />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/shopping" element={<Shopping />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin-placeholders" element={<AdminPlaceholderMigration />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LazyMotion>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
