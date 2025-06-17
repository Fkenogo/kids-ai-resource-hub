
-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  read_time INTEGER DEFAULT 5,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  parent_comment_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Authors can view their own blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can view all blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blog posts" 
  ON public.blog_posts 
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts" 
  ON public.blog_posts 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts" 
  ON public.blog_posts 
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable RLS on blog_comments
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Blog comments policies
CREATE POLICY "Anyone can view approved comments" 
  ON public.blog_comments 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Authors can view their own comments" 
  ON public.blog_comments 
  FOR SELECT 
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can view all comments" 
  ON public.blog_comments 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can insert comments" 
  ON public.blog_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own comments" 
  ON public.blog_comments 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can update all comments" 
  ON public.blog_comments 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete comments" 
  ON public.blog_comments 
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_comments_post ON public.blog_comments(post_id);
CREATE INDEX idx_blog_comments_approved ON public.blog_comments(is_approved);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON public.blog_posts 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at 
  BEFORE UPDATE ON public.blog_comments 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Function to automatically set published_at when post is published
CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = now();
  ELSIF NEW.is_published = false THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Add trigger for published_at
CREATE TRIGGER set_blog_post_published_at 
  BEFORE UPDATE ON public.blog_posts 
  FOR EACH ROW EXECUTE PROCEDURE public.set_published_at();
