[![npm](https://img.shields.io/npm/v/jotai-loadable.svg)](https://www.npmjs.com/package/jotai-loadable) ![downloads](https://img.shields.io/npm/dt/jotai-loadable.svg) [![CI](https://github.com/wojtekmaj/jotai-loadable/actions/workflows/ci.yml/badge.svg)](https://github.com/wojtekmaj/jotai-loadable/actions)

# Jotai-Loadable

Turn an async Jotai atom into a loadable atom with `loading`, `hasData`, and `hasError` states.

## tl;dr

- Install by executing `npm install jotai jotai-loadable` or `yarn add jotai jotai-loadable`.
- Import by adding `import { loadable } from 'jotai-loadable'`.
- Use it by writing `const loadableAtom = loadable(asyncAtom)`.

## Examples

```ts
import { atom } from 'jotai';
import { loadable } from 'jotai-loadable';

const asyncAtom = atom(async () => {
  const response = await fetch('/api/user');
  return response.json() as Promise<{ name: string }>;
});

const loadableAtom = loadable(asyncAtom);

// {
//   state: 'loading'
// }
//
// {
//   state: 'hasData',
//   data: { name: 'Wojciech' }
// }
//
// {
//   state: 'hasError',
//   error: Error
// }
```

## License

The MIT License.

## Author

<table>
  <tr>
    <td >
      <img src="https://avatars.githubusercontent.com/u/5426427?v=4&s=128" width="64" height="64" alt="Wojciech Maj">
    </td>
    <td>
      <a href="https://github.com/wojtekmaj">Wojciech Maj</a>
    </td>
  </tr>
</table>
