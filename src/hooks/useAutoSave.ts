
import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';

interface UseAutoSaveProps {
  enabled: boolean;
  formData: Record<string, unknown>;
  onAutoSave: () => void;
  interval?: number;
}

export const useAutoSave = ({ enabled, formData, onAutoSave, interval = 30000 }: UseAutoSaveProps) => {
  const lastSnapshotRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const autoSaveInterval = setInterval(() => {
      const snapshot = JSON.stringify(formData);
      const hasContent = Boolean(
        (formData.title as string | undefined)?.trim() ||
          (formData.content as string | undefined)?.trim(),
      );

      if (!hasContent) return;
      if (snapshot === lastSnapshotRef.current) return;

      lastSnapshotRef.current = snapshot;
      logger.debug('Auto-saving draft...');
      onAutoSave();
    }, interval);

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [enabled, formData, onAutoSave, interval]);
};
