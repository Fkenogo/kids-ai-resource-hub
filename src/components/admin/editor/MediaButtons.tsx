
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image, Link, Table, Minus, Video, Code, Upload } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';

interface MediaButtonsProps {
  editor: Editor;
}

export const MediaButtons = ({ editor }: MediaButtonsProps) => {
  const [imageDialog, setImageDialog] = useState(false);
  const [linkDialog, setLinkDialog] = useState(false);
  const [videoDialog, setVideoDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const insertImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ 
        src: imageUrl, 
        alt: imageAlt || undefined 
      }).run();
      setImageDialog(false);
      setImageUrl('');
      setImageAlt('');
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}"${openInNewTab ? ' target="_blank"' : ''}>${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl, target: openInNewTab ? '_blank' : undefined }).run();
      }
      setLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      setOpenInNewTab(false);
    }
  };

  const insertVideo = () => {
    if (videoUrl) {
      // Check if it's a YouTube URL
      const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (youtubeMatch) {
        editor.chain().focus().setYoutubeVideo({
          src: videoUrl,
          width: 640,
          height: 480,
        }).run();
      } else {
        // For other video URLs, insert as regular video
        editor.chain().focus().insertContent(`
          <video controls style="max-width: 100%; height: auto;">
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `).run();
      }
      setVideoDialog(false);
      setVideoUrl('');
    }
  };

  const insertCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <>
      {/* Image Dialog */}
      <Dialog open={imageDialog} onOpenChange={setImageDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" title="Insert Image">
            <Image className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Upload Image</Label>
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Choose image file"
              />
            </div>
            
            <div>
              <Label htmlFor="imageUrl">Or enter image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="imageAlt">Alt text (optional)</Label>
              <Input
                id="imageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            
            <Button onClick={insertImage} className="w-full">
              Insert Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" title="Insert Link">
            <Link className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkUrl">URL *</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="linkText">Display text (optional)</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Link text"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newTab"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
              />
              <Label htmlFor="newTab">Open in new tab</Label>
            </div>
            
            <Button onClick={insertLink} className="w-full">
              Insert Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialog} onOpenChange={setVideoDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" title="Insert Video">
            <Video className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube, Vimeo, or direct video URL"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports YouTube, Vimeo, and direct video file URLs
              </p>
            </div>
            
            <Button onClick={insertVideo} className="w-full">
              Insert Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="ghost" size="sm" onClick={insertCodeBlock} title="Code Block">
        <Code className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={insertTable} title="Insert Table">
        <Table className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </>
  );
};
