# Hostinger deployment

Use Node 22, npm, `npm run build`, output directory `.next`, and the Next.js application preset. The repository build command explicitly uses Webpack: Hostinger's previous Turbopack build crashed while starting a PostCSS worker. Keep `npm run build` in the dashboard so this choice is respected.

Install reproducibly with `npm ci` when an install-command setting is available. Commit both package files. Production canonical URLs, sitemap entries and social images default to `https://pixellayerss.com`; `NEXT_PUBLIC_SITE_URL` can override that domain.

## Security update — 2026-10-19

- Next.js and its ESLint configuration: 16.4.2.
- Tailwind and its PostCSS plugin: 4.3.3.
- Lockfile refreshed with compatible security updates, including Sharp 0.35.5 and PostCSS 8.5.23.
- `npm audit --omit=dev`: zero reported vulnerabilities.
- Full `npm audit`: five high findings along one development-only dependency chain: `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`.

The remaining [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) has no published patched version as of this check. It concerns deeply nested glob patterns exhausting the stack. The site's runtime does not depend on this package; the lint config does not accept external root-directory glob patterns. Retain the supported Next.js lint configuration and rerun the full audit when an upstream patch becomes available. Do not run `npm audit fix --force`: its current proposal downgrades the lint configuration to Next 14 and does not represent a compatible upgrade. No audit findings have been suppressed.

## Release checks

```sh
npm ci
npm run lint
npm run build
node scripts/check-resolution-hero.mjs
node scripts/check-studio-sequence.mjs
npm audit --omit=dev
npm start -- -p 3015
# In another terminal:
node scripts/audit-preview.mjs http://localhost:3015
node scripts/audit-journeys.mjs http://localhost:3015
```

After pushing `main`, verify the new commit reaches **Completed / Current** in Hostinger Deployments. Hostinger scans dependencies again after redeployment; a cached scan of an older deployment does not verify the new lockfile. Confirm the live homepage has the Resolution hero, and check `/brand-image`, `/sitemap.xml` and a service/project detail page.
