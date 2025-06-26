
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { m } from 'framer-motion';
import { useLeaderboard } from '@/hooks/useCommunityData';

export const LeaderboardReal = () => {
  const { data: leaderboard = [], isLoading } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Community Leaders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Community Leaders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboard.map((user, index) => (
          <m.div
            key={user.userId}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 flex justify-center">
                {getRankIcon(user.rank)}
              </div>
              
              <Avatar>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-primary text-white w-full h-full flex items-center justify-center text-lg">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              
              <div>
                <p className="font-medium">{user.displayName}</p>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-primary">{user.points}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </m.div>
        ))}
        
        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No community leaders yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
