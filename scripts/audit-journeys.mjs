/** Verify release content and conversion destinations against the served site.
 * Does not replace browser interaction or responsive visual QA.
 * Usage: node scripts/audit-journeys.mjs http://localhost:3015
 */
import assert from "node:assert/strict";
const base = process.argv[2] || "http://localhost:3015";
const slugs = [
  "websites",
  "ecommerce-shopify",
  "web-apps-saas",
  "ai-automation",
  "ai-chatbots",
  "business-systems",
  "landing-pages",
  "website-redesign",
  "conversion-optimization",
  "website-care",
];
async function page(path) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} loads`);
  const text = await response.text();
  assert.equal((text.match(/<h1\b/g) || []).length, 1, `${path} has one h1`);
  for (const [button] of text.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)) {
    assert.doesNotMatch(
      button,
      /(?:Pause|Resume|Play) (?:motion|logos|journey|the journey|walkthrough|service walkthrough)/i,
      `${path}: no motion playback buttons`,
    );
  }
  return text;
}
const home = await page("/");
assert.equal(
  (home.match(/class="service-visual-card"/g) || []).length,
  6,
  "Six visible homepage service cards",
);
assert.equal(
  (home.match(/data-project="/g) || []).length,
  15,
  "All portfolio projects remain once in the reel",
);
for (const slug of ["the-sugar-story", "la-vallee-farms"])
  assert.ok(
    home.includes(`project=${slug}`),
    "Specialty enquiry carries project context",
  );
assert.ok(
  home.includes("conversion-heading"),
  "Homepage explains a conversion journey",
);
assert.ok(
  !home.includes("Client testimonials"),
  "Unverified quotation block is removed",
);
const schema = JSON.parse(
  home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
);
assert.ok(
  schema["@graph"].every((item) => !item.review && item["@type"] !== "Review"),
  "Unverified reviews are absent from structured data",
);
const services = await page("/services");
assert.equal(
  (services.match(/class="service-visual-card"/g) || []).length,
  10,
  "All 10 services are visible",
);
for (const slug of slugs) {
  const html = await page(`/services/${slug}`);
  assert.ok(
    html.includes(`/contact?service=${slug}`),
    `${slug}: contextual CTA`,
  );
  assert.ok(
    html.includes("service-review-output"),
    `${slug}: review checkpoints`,
  );
  assert.ok(
    !html.includes("Pause service walkthrough"),
    `${slug}: no visible pause control`,
  );
}
const sugar = await page("/work/the-sugar-story");
assert.match(
  sugar,
  /<a[^>]+class="studio-project-cover"[^>]+target="_blank"/,
  "Case-study screenshot opens the live website",
);
assert.ok(
  sugar.includes("dessert-hampers-gifting-bhopal"),
  "Sugar Story shows its real hamper journey",
);
const contact = await page(
  "/contact?service=ecommerce-shopify&project=the-sugar-story",
);
assert.match(
  contact,
  /<input[^>]+checked=""[^>]+value="E-commerce \/ Shopify"/,
  "Service selection survives navigation",
);
assert.ok(
  contact.includes("The Sugar Story"),
  "Verified project context is shown",
);
const bad = await page("/contact?service=unknown&project=unknown");
assert.ok(
  !bad.includes("YOUR REFERENCE"),
  "Unknown project context is ignored",
);
const approach = await page("/approach");
assert.ok(
  approach.includes("delivery-review-grid"),
  "Approach includes review responsibilities",
);
await page("/website-audit");
console.log(
  "PASS: homepage proof, 10 service journeys, project links, contextual enquiries and process handover.",
);
