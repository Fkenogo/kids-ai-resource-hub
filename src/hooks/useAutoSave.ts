
import { useEffect } from 'react';

interface UseAutoSaveProps {
  enabled: boolean;
  formData: any;
  onAutoSave: () => void;
  interval?: number;
}

export const useAutoSave = ({ enabled, formData, onAutoSave, interval = 30000 }: UseAutoSaveProps) => {
  useEffect(() => {
    // Temporarily disable auto-save to prevent authentication errors
    if (!enabled) {
      console.log('Auto-save disabled');
      return;
    }
    
    console.log('Auto-save feature temporarily disabled to prevent authentication issues');
    
    // TODO: Re-enable once authentication is stable
    // const autoSaveInterval = setInterval(() => {
    //   if (formData.title || formData.content) {
    //     console.log('Auto-save triggered - content exists');
    //     onAutoSave();
    //   } else {
    //     console.log('Auto-save skipped - no content');
    //   }
    // }, interval);

    // return () => {
    //   console.log('Cleaning up auto-save interval');
    //   clearInterval(autoSaveInterval);
    // };
  }, [enabled, formData, onAutoSave, interval]);
};
