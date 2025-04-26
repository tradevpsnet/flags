# flags
The set of flags from TradeVPS

## 🌐 Flag Icons
Each flag is a self-contained React component and can be resized using standard `width` and `height` props.
We use optimized SVGs with optional `viewBox` support, so they scale and behave consistently.

You can import flags using either **PascalCase** names (e.g., `UnitedKingdom`, `France`, `Germany`) or **ISO 3166-1 alpha-2 codes** (e.g., `Gb`, `Fr`, `De`) depending on your preference or automation tooling.


### 🛠️ Setup (Next.js projects)


install
```bash
npm i @tradevpsnet/flags
```

To use this library in a Next.js app, add the following to your `next.config.js`:

```js
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
```

Also install the following package:

```bash
npm install --save-dev @svgr/webpack
```

### Attributes

| Name     | Type | Description |
|:---------|:-----|:------------|
| width    | number | Sets the width of the flag. Defaults to `40`. |
| height   | number | Sets the height of the flag. Defaults to `30`. |
| viewBox  | string | Custom `viewBox` for advanced control. Automatically generated if not present in original SVG. |
| ...props | any | All other SVG-compatible props like `className`, `style`, `aria-label`, etc. |

---

### 🌐 Flags

You can import flags by either ISO code or PascalCase name.

Example usage:

```jsx
import { Gb } from 'flags';

export default function Example() {
  return <Gb width={48} height={36} />;
}
```

---

Enjoy using `flags` in your project! 🌐🌟

