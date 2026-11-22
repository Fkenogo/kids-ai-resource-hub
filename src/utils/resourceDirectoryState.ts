export type ResourceDirectoryState = 'loading' | 'error' | 'empty' | 'results';

export const getResourceDirectoryState = (input: {
  isLoading: boolean;
  hasError: boolean;
  resourceCount: number;
}): ResourceDirectoryState => {
  if (input.isLoading) return 'loading';
  if (input.hasError) return 'error';
  return input.resourceCount > 0 ? 'results' : 'empty';
};
