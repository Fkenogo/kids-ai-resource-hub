import test from 'node:test';
import assert from 'node:assert/strict';
import { getResourceDirectoryState } from '../src/utils/resourceDirectoryState.ts';

test('does not render a transient zero-result empty state while loading', () => {
  assert.equal(getResourceDirectoryState({ isLoading: true, hasError: false, resourceCount: 0 }), 'loading');
});

test('keeps Firestore request failures distinct from a successful empty result', () => {
  assert.equal(getResourceDirectoryState({ isLoading: false, hasError: true, resourceCount: 0 }), 'error');
  assert.equal(getResourceDirectoryState({ isLoading: false, hasError: false, resourceCount: 0 }), 'empty');
});

test('shows results after a successful public query returns records', () => {
  assert.equal(getResourceDirectoryState({ isLoading: false, hasError: false, resourceCount: 9 }), 'results');
});
