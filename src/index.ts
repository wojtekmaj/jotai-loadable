import { atom } from 'jotai/vanilla';
import { unwrap } from 'jotai/vanilla/utils';

import type { Atom } from 'jotai/vanilla';

declare global {
  interface ImportMeta {
    readonly env?: Record<string, string>;
  }
}

const cache = new WeakMap();

const memo = <T>(create: () => T, dep1: object): T =>
  (cache.has(dep1) ? cache : cache.set(dep1, create())).get(dep1);

export type Loadable<Value> =
  | { state: 'loading' }
  | { state: 'hasError'; error: unknown }
  | { state: 'hasData'; data: Awaited<Value> };

export function loadable<Value>(anAtom: Atom<Value>): Atom<Loadable<Value>> {
  return memo(() => {
    const LOADING: Loadable<Value> = { state: 'loading' };

    const unwrappedAtom = unwrap(anAtom, () => LOADING);
    if (import.meta.env?.MODE !== 'production') {
      unwrappedAtom.debugPrivate = true;
    }

    return atom((get) => {
      try {
        const data = get(unwrappedAtom);

        if (data === LOADING) {
          return LOADING;
        }

        return {
          state: 'hasData',
          data,
        } as Loadable<Value>;
      } catch (error) {
        return {
          state: 'hasError',
          error,
        };
      }
    });
  }, anAtom);
}
