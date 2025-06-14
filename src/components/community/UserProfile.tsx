
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  UserPlus, 
  Settings, 
  Trophy, 
  MessageSquare, 
  Heart,
  Calendar
} from 'lucide-react';

const currentUser = {
  id: 'current-user',
  displayName: 'Alex Parent',
  username: 'alex_ai_parent',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  bio: 'Father of two curious kids aged 8 and 12. Software engineer passionate about AI education.',
  joinDate: '2023-09-15',
  points: 340,
  nextLevelPoints: 500,
  rank: 15,
  posts: 8,
  replies: 23,
  likes: 156,
  followers: 12,
  following: 28,
  badges: [
    { name: 'New Member', icon: '🌟' },
    { name: 'First Post', icon: '📝' }
  ]
};

const recentActivity = [
  {
    id: '1',
    type: 'post',
    title: 'Looking for AI resources for 8-year-old',
    date: '2 hours ago',
    likes: 5
  },
  {
    id: '2',
    type: 'reply',
    title: 'Re: Teachable Machine alternatives',
    date: '1 day ago',
    likes: 8
  },
  {
    id: '3',
    type: 'like',
    title: 'Liked: Amazing AI art project by 10-year-old',
    date: '2 days ago',
    likes: 0
  }
];

export const UserProfile = () => {
  const progressPercentage = (currentUser.points / currentUser.nextLevelPoints) * 100;

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg">{currentUser.displayName}</CardTitle>
          <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-center">{currentUser.bio}</p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{currentUser.points}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">#{currentUser.rank}</div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
          </div>
          
          {/* Progress to next level */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to next level</span>
              <span>{currentUser.points}/{currentUser.nextLevelPoints}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {/* Badges */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Badges</h4>
            <div className="flex flex-wrap gap-2">
              {currentUser.badges.map(badge => (
                <Badge key={badge.name} variant="secondary" className="text-xs">
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Activity Stats */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <MessageSquare className="h-4 w-4 mx-auto mb-1" />
              <div className="font-semibold">{currentUser.posts}</div>
              <div className="text-muted-foreground">Posts</div>
            </div>
            <div>
              <MessageSquare className="h-4 w-4 mx-auto mb-1" />
              <div className="font-semibold">{currentUser.replies}</div>
              <div className="text-muted-foreground">Replies</div>
            </div>
            <div>
              <Heart className="h-4 w-4 mx-auto mb-1" />
              <div className="font-semibold">{currentUser.likes}</div>
              <div className="text-muted-foreground">Likes</div>
            </div>
            <div>
              <UserPlus className="h-4 w-4 mx-auto mb-1" />
              <div className="font-semibold">{currentUser.followers}</div>
              <div className="text-muted-foreground">Followers</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button className="flex-1" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Follow
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-start space-x-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="line-clamp-2">{activity.title}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{activity.date}</span>
                  {activity.likes > 0 && (
                    <>
                      <Heart className="h-3 w-3" />
                      <span>{activity.likes} likes</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
