/**
 * Captures portfolio screenshots + page metadata for the Selected Work section.
 * Usage: node scripts/capture-work.mjs [slug ...]   (no args = all projects)
 * Output: public/work/<slug>.webp + scripts/work-meta.json
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import puppeteer from "puppeteer";

const PROJECTS = [
  { slug: "the-sugar-story", url: "https://thesugarstory.co.in" },
  { slug: "baby-steps", url: "https://drclinicbhopal-three.vercel.app" },
  { slug: "aranyaani", url: "https://aranyaani-brown.vercel.app" },
  { slug: "la-vallee-farms", url: "https://lavalleefarms.vercel.app" },
  {
    slug: "la-vallee-masterplan",
    url: "https://lavalleefarms.vercel.app",
    // Featured card shows the interactive masterplan, not the homepage.
    prepare: async (page) => {
      const target = await page.evaluate(() => {
        const el =
          document.querySelector('[id*="masterplan" i]') ||
          document.querySelector('[class*="masterplan" i]') ||
          [...document.querySelectorAll("h1,h2,h3")].find((h) =>
            /master\s*plan/i.test(h.textContent || ""),
          );
        if (!el) return false;
        el.scrollIntoView({ block: "start" });
        return true;
      });
      await new Promise((r) => setTimeout(r, 2500));
      return target;
    },
  },
  { slug: "apna-dental", url: "https://aapnadentalclinic.lovable.app" },
  { slug: "dpm-entertainment", url: "https://register.dpmentertainment.com" },
  { slug: "ai-buddies", url: "https://aibuddies-nu.vercel.app" },
  { slug: "harsh-traders", url: "https://harshtraders.lovable.app" },
  { slug: "8flowlabs", url: "https://8flowlabsai.netlify.app" },
  { slug: "kliqcraft", url: "https://kliqcraft.netlify.app" },
  { slug: "shoolin-chemicals", url: "https://www.shoolinchemicals.com" },
  { slug: "ivy-estate", url: "https://ivyestatebhopal.netlify.app" },
];

const only = process.argv.slice(2);
const list = only.length
  ? PROJECTS.filter((p) => only.includes(p.slug))
  : PROJECTS;

await mkdir("public/work", { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});

let meta = {};
try {
  meta = JSON.parse(await readFile("scripts/work-meta.json", "utf8"));
} catch {}

for (const project of list) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  );
  try {
    await page.goto(project.url, { waitUntil: "networkidle2", timeout: 45000 });
  } catch (err) {
    console.warn(`${project.slug}: navigation settled late (${err.message})`);
  }
  // Let entrance animations finish
  await new Promise((r) => setTimeout(r, 3500));

  let prepared = true;
  if (project.prepare) prepared = await project.prepare(page);

  const info = await page.evaluate(() => ({
    title: document.title,
    description:
      document.querySelector('meta[name="description"]')?.content || "",
    h1: [...document.querySelectorAll("h1")]
      .map((h) => h.textContent?.trim())
      .filter(Boolean)
      .slice(0, 2),
    headings: [...document.querySelectorAll("h2")]
      .map((h) => h.textContent?.trim())
      .filter(Boolean)
      .slice(0, 8),
  }));

  await page.screenshot({
    path: `public/work/${project.slug}.webp`,
    type: "webp",
    quality: 82,
  });

  meta[project.slug] = { url: project.url, prepared, ...info };
  console.log(`✓ ${project.slug}${prepared ? "" : " (prepare target NOT found)"}`);
  await page.close();
}

await writeFile("scripts/work-meta.json", JSON.stringify(meta, null, 2));
await browser.close();
console.log("done");
