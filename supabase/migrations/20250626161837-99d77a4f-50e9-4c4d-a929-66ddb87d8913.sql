
-- Enable RLS on community tables
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagements ENABLE ROW LEVEL SECURITY;

-- Community Posts policies
CREATE POLICY "Anyone can view community posts" 
  ON public.community_posts 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts" 
  ON public.community_posts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" 
  ON public.community_posts 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.community_posts 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = author_id);

-- Community Replies policies
CREATE POLICY "Anyone can view community replies" 
  ON public.community_replies 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own replies" 
  ON public.community_replies 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own replies" 
  ON public.community_replies 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies" 
  ON public.community_replies 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = author_id);

-- User Engagements policies
CREATE POLICY "Users can view all engagements" 
  ON public.user_engagements 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own engagements" 
  ON public.user_engagements 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own engagements" 
  ON public.user_engagements 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies for community management
CREATE POLICY "Admins can manage all community posts" 
  ON public.community_posts 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all community replies" 
  ON public.community_replies 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
