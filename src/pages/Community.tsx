
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { CommunityCategories } from '@/components/community/CommunityCategories';
import { ProjectShowcase } from '@/components/community/ProjectShowcase';
import { Leaderboard } from '@/components/community/Leaderboard';
import { CreatePostDialog } from '@/components/community/CreatePostDialog';
import { UserProfile } from '@/components/community/UserProfile';
import { NotificationPanel } from '@/components/community/NotificationPanel';
import { Plus, Bell, Users, Trophy, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Community = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <motion.h1 
                className="text-4xl font-bold gradient-text mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Community Forum
              </motion.h1>
              <p className="text-lg text-muted-foreground">
                Connect with other parents on their AI education journey
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <Button 
                onClick={() => setShowCreatePost(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:col-span-1">
              <CommunityCategories />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="feed" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Feed</span>
                  </TabsTrigger>
                  <TabsTrigger value="showcase" className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4" />
                    <span>Showcase</span>
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <span>Leaders</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="mt-6">
                  <CommunityFeed />
                </TabsContent>

                <TabsContent value="showcase" className="mt-6">
                  <ProjectShowcase />
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-6">
                  <Leaderboard />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar - User Profile & Activity */}
            <div className="lg:col-span-1">
              <UserProfile />
            </div>
          </div>
        </div>

        {/* Dialogs */}
        {showCreatePost && (
          <CreatePostDialog 
            open={showCreatePost} 
            onClose={() => setShowCreatePost(false)} 
          />
        )}

        {showNotifications && (
          <NotificationPanel 
            open={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Community;
