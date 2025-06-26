
import React from 'react';

interface EditorStatsProps {
  wordCount: number;
  readTime: number;
}

export const EditorStats = ({ wordCount, readTime }: EditorStatsProps) => {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>{wordCount} words</span>
      <span>{readTime} min read</span>
    </div>
  );
};
