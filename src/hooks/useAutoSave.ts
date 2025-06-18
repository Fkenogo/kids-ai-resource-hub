
import { useEffect } from 'react';

interface UseAutoSaveProps {
  enabled: boolean;
  formData: any;
  onAutoSave: () => void;
  interval?: number;
}

export const useAutoSave = ({ enabled, formData, onAutoSave, interval = 30000 }: UseAutoSaveProps) => {
  useEffect(() => {
    if (!enabled) return;
    
    const autoSaveInterval = setInterval(() => {
      if (formData.title || formData.content) {
        onAutoSave();
      }
    }, interval);

    return () => clearInterval(autoSaveInterval);
  }, [enabled, formData, onAutoSave, interval]);
};
