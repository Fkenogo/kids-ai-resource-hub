
import { useEffect } from 'react';

interface UseAutoSaveProps {
  enabled: boolean;
  formData: any;
  onAutoSave: () => void;
  interval?: number;
}

export const useAutoSave = ({ enabled, formData, onAutoSave, interval = 30000 }: UseAutoSaveProps) => {
  useEffect(() => {
    if (!enabled) {
      console.log('Auto-save disabled');
      return;
    }
    
    console.log('Setting up auto-save with interval:', interval);
    
    const autoSaveInterval = setInterval(() => {
      if (formData.title || formData.content) {
        console.log('Auto-save triggered - content exists');
        onAutoSave();
      } else {
        console.log('Auto-save skipped - no content');
      }
    }, interval);

    return () => {
      console.log('Cleaning up auto-save interval');
      clearInterval(autoSaveInterval);
    };
  }, [enabled, formData, onAutoSave, interval]);
};
