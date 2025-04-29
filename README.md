## 🌐 Flags
Each flag is a self-contained React component and can be resized using standard `width` and `height` props.
We use optimized SVGs with optional `viewBox` support, so they scale and behave consistently.

You can import flags using either **PascalCase** names (e.g., `UnitedKingdom`, `France`, `Germany`) or **[ISO 3166-1 alpha-2 codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)** (e.g., `Gb`, `Fr`, `De`) depending on your preference or automation tooling.


### 🛠️ Setup


#### install
```bash
npm i @tradevpsnet/flags
```
#### basic usage
```js
import {Germany} from '@tradevpsnet/flags';

export default function Home() {
  return (
    <div className="flex gap-4">
      <Germany />
    </div>
  );
}
````
### Public CDN
Or if you prefer, you can use our hosted API to directly fetch SVGs without installing anything [https://flags.apis.tradevps.net/gb.svg](https://flags.apis.tradevps.net/gb.svg)

#### Example
````js
<img src="https://flags.apis.tradevps.net/de.svg" alt="Germany Flag" width="100" />
````


#### Next.js Config
To use this library in a Next.js app, add the following to your `next.config.js`:

```js

  transpilePackages: ['@tradevpsnet/flags'], // Explicitly transpile this package
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
```

Also install the following package:

```bash
npm install --save-dev @svgr/webpack
```

### Attributes
All props are optional:


| Name     | Type | Description |
|:---------|:-----|:------------|
| width    | number | Sets the width of the flag. Defaults to `40px`. |
| height   | number | Sets the height of the flag. Defaults to `30px`. |
| viewBox  | string | Custom `viewBox` for advanced control. Automatically generated if not present in original SVG. |
| ...props | any | All other SVG-compatible props like `className`, `style`, `aria-label`, etc. |

---

### Usage

You can import flags by either ISO code or PascalCase name.

Example usage:

```jsx
import { Gb, France, Cn, Germany  } from '@tradevpsnet/flags';

export default function Example() {
  return (
    <France />
    <Gb width={48} height={36} />
    
    <Gb width={50} height={40} />
    <Germany style={{ height: '1.5em' }} />

    <Cn 
      className="border rounded"
      aria-label="China flag"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    />
  );
}
```

---

Enjoy using `flags` in your project! 🌐🌟

