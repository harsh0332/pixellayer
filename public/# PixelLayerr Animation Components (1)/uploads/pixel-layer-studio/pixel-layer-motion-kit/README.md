# Pixel Layer interaction kit

This is a layout-neutral App Router layer. It adds a shared environmental field and scoped interaction primitives; it does not bring its own spacing, type scale, palette, or page structure.

Install the peer dependency in the host project:

```bash
npm install framer-motion
```

Wrap the existing page in `app/layout.tsx` or the relevant route:

```tsx
import { MotionEnvironment } from '@/components/motion/MotionEnvironment';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <MotionEnvironment>{children}</MotionEnvironment>;
}
```

Use the primitives without changing markup hierarchy:

- Wrap each heading line with `OpticalReveal`; it resolves with clip-path and focus, never an opacity fade.
- Wrap existing service cards with `DepthCard maxTilt={4}`; card content and styling remain yours.
- Wrap existing portfolio image containers with `PortfolioSurface`; it adds internal parallax, material light, and a border travel only on hover.
- Wrap the current process path with `ProcessEnergy`; the energy pulse only runs while the section is in view.

The components honor reduced motion, have no global CSS selectors, avoid springs/bounces, and use motion values plus `requestAnimationFrame` for the shared field.
