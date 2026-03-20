import { describe, expect, it } from 'vitest';
import { atom, createStore } from 'jotai/vanilla';

import { loadable } from './index.js';

describe('loadable', () => {
  it('returns hasData for a synchronous atom', () => {
    const anAtom = atom(42);

    const loadableAtom = loadable(anAtom);

    const store = createStore();

    expect(store.get(loadableAtom)).toEqual({
      state: 'hasData',
      data: 42,
    });
  });

  it('returns loading for a pending asynchronous atom', () => {
    const deferred = Promise.withResolvers<number>();

    const anAtom = atom(async () => deferred.promise);

    const loadableAtom = loadable(anAtom);

    const store = createStore();

    expect(store.get(loadableAtom)).toEqual({
      state: 'loading',
    });
  });

  it('returns hasData when an asynchronous atom resolves', async () => {
    const deferred = Promise.withResolvers<number>();

    const anAtom = atom(async () => deferred.promise);

    const loadableAtom = loadable(anAtom);

    const store = createStore();

    const updated = new Promise<void>((resolve) => {
      const unsubscribe = store.sub(loadableAtom, () => {
        unsubscribe();
        resolve();
      });
    });

    deferred.resolve(42);

    await updated;

    expect(store.get(loadableAtom)).toEqual({
      state: 'hasData',
      data: 42,
    });
  });

  it('returns hasError when an atom throws', () => {
    const error = new Error('Boom');

    const anAtom = atom(() => {
      throw error;
    });

    const loadableAtom = loadable(anAtom);

    const store = createStore();

    expect(store.get(loadableAtom)).toEqual({
      state: 'hasError',
      error,
    });
  });
});
