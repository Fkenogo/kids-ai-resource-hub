
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Trophy, 
  AtSign,
  Check
} from 'lucide-react';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: '1',
    type: 'like',
    title: 'Sarah M. liked your post',
    message: '"Looking for AI resources for 8-year-old"',
    time: '5 minutes ago',
    isRead: false,
    user: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    }
  },
  {
    id: '2',
    type: 'reply',
    title: 'New reply to your post',
    message: 'Mike T. replied: "Have you tried Teachable Machine? It\'s perfect for that age group!"',
    time: '1 hour ago',
    isRead: false,
    user: {
      name: 'Mike T.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    }
  },
  {
    id: '3',
    type: 'follow',
    title: 'New follower',
    message: 'Jennifer L. started following you',
    time: '2 hours ago',
    isRead: true,
    user: {
      name: 'Jennifer L.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  },
  {
    id: '4',
    type: 'badge',
    title: 'New badge earned!',
    message: 'You earned the "Helpful Contributor" badge',
    time: '1 day ago',
    isRead: true,
    user: null
  },
  {
    id: '5',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Alex K. mentioned you in "Best AI tools for beginners"',
    time: '2 days ago',
    isRead: true,
    user: {
      name: 'Alex K.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-red-500" />;
    case 'reply':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'badge':
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case 'mention':
      return <AtSign className="h-4 w-4 text-purple-500" />;
    default:
      return <MessageCircle className="h-4 w-4 text-gray-500" />;
  }
};

export const NotificationPanel = ({ open, onClose }: NotificationPanelProps) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>
          
          <div className="space-y-4">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                  !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-background'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {notification.user ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      <p className="text-sm font-semibold">{notification.title}</p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
