
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { mockCommunityUsers } from '@/data/communityData';
import { m } from 'framer-motion';

export const Leaderboard = () => {
  // Since mockCommunityUsers is empty, leaderboard will be empty
  const topUsers = mockCommunityUsers
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Community Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h3 className="font-semibold mb-2">No Rankings Yet</h3>
            <p className="text-sm text-muted-foreground">
              Start participating in the community to appear on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <m.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index + 1)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{user.displayName}</span>
                    {user.badges.length > 0 && (
                      <div className="flex space-x-1">
                        {user.badges.slice(0, 2).map(badge => (
                          <span key={badge.id} className="text-xs">
                            {badge.icon}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.postCount} posts • {user.replyCount} replies
                  </div>
                </div>
                
                <Badge variant="secondary" className="font-mono text-xs">
                  {user.points} pts
                </Badge>
              </m.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
