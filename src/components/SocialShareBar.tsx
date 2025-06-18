
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Share2, Link, MessageSquare, Send } from 'lucide-react';

interface SocialShareBarProps {
  url: string;
  title: string;
  description?: string;
  sticky?: boolean;
}

export const SocialShareBar = ({ url, title, description, sticky = false }: SocialShareBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shareData = {
    title,
    text: description || title,
    url: url,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, '_blank');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const containerClass = sticky 
    ? "fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 bg-background border rounded-lg p-2 shadow-lg"
    : "flex items-center gap-2 p-4 bg-background border rounded-lg";

  return (
    <div className={containerClass}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => sticky ? setIsExpanded(!isExpanded) : nativeShare()}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        {!sticky && 'Share'}
      </Button>

      {((!sticky) || (sticky && isExpanded)) && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={shareToLinkedIn}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            LinkedIn
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={shareToTwitter}
            className="text-blue-400 hover:text-blue-500 hover:bg-blue-50"
          >
            X (Twitter)
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={shareToFacebook}
            className="text-blue-800 hover:text-blue-900 hover:bg-blue-50"
          >
            Facebook
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={shareToWhatsApp}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <MessageSquare className="h-4 w-4" />
            {!sticky && 'WhatsApp'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={shareToTelegram}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Send className="h-4 w-4" />
            {!sticky && 'Telegram'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
          >
            <Link className="h-4 w-4" />
            {!sticky && 'Copy Link'}
          </Button>
        </>
      )}
    </div>
  );
};
