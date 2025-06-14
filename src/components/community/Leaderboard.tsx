
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const leaderboard = [
  {
    rank: 1,
    userId: '1',
    username: 'ai_parent_sarah',
    displayName: 'Sarah M.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    points: 2450,
    badges: ['Top Contributor', 'Helper', 'Early Adopter'],
    posts: 45,
    helpfulReplies: 128
  },
  {
    rank: 2,
    userId: '2',
    username: 'tech_dad_mike',
    displayName: 'Mike T.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    points: 2180,
    badges: ['Project Showcase Star', 'Mentor'],
    posts: 38,
    helpfulReplies: 95
  },
  {
    rank: 3,
    userId: '3',
    username: 'coding_mom_jen',
    displayName: 'Jennifer L.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    points: 1890,
    badges: ['Creative Contributor', 'Problem Solver'],
    posts: 32,
    helpfulReplies: 87
  },
  {
    rank: 4,
    userId: '4',
    username: 'ai_educator_alex',
    displayName: 'Alex K.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    points: 1650,
    badges: ['Curriculum Expert'],
    posts: 28,
    helpfulReplies: 74
  },
  {
    rank: 5,
    userId: '5',
    username: 'stem_parent_lisa',
    displayName: 'Lisa R.',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    points: 1420,
    badges: ['Resource Hunter'],
    posts: 25,
    helpfulReplies: 63
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <Star className="h-6 w-6 text-gray-300" />;
  }
};

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 2:
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 3:
      return 'bg-amber-100 text-amber-800 border-amber-300';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-300';
  }
};

export const Leaderboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Community Leaderboard</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Contributors This Month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Badge className={`${getRankBadgeColor(user.rank)} font-bold`}>
                  #{user.rank}
                </Badge>
                {getRankIcon(user.rank)}
              </div>
              
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-semibold">{user.displayName}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.badges.slice(0, 2).map(badge => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                  {user.badges.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{user.badges.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{user.points}</div>
                <div className="text-xs text-muted-foreground">points</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {user.posts} posts • {user.helpfulReplies} replies
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>How Points Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Create a helpful post</span>
            <span className="font-semibold">+10 points</span>
          </div>
          <div className="flex justify-between">
            <span>Receive a like on your post</span>
            <span className="font-semibold">+5 points</span>
          </div>
          <div className="flex justify-between">
            <span>Reply marked as helpful</span>
            <span className="font-semibold">+15 points</span>
          </div>
          <div className="flex justify-between">
            <span>Share a project showcase</span>
            <span className="font-semibold">+25 points</span>
          </div>
          <div className="flex justify-between">
            <span>Complete community challenges</span>
            <span className="font-semibold">+50 points</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
