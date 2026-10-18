export type ServiceMode =
  | "design"
  | "store"
  | "product"
  | "workflow"
  | "chat"
  | "system"
  | "campaign"
  | "redesign"
  | "experiment"
  | "care";
export type StudioService = {
  slug: string;
  title: string;
  short: string;
  heading: string;
  accent: string;
  intro: string;
  need: string;
  mode: ServiceMode;
  fit: string[];
  deliverables: [string, string][];
  steps: [string, string][];
  questions: [string, string][];
  projects: string[];
};
export const STUDIO_SERVICES: StudioService[] = [
  {
    slug: "websites",
    title: "Website design & development",
    short: "A distinctive home for your business.",
    heading: "A website that feels like you.",
    accent: "And works for them.",
    intro:
      "Turn a first impression into a clear next step. We connect positioning, thoughtful design and dependable development to help the right visitors understand your business and get in touch.",
    need: "Website",
    mode: "design",
    fit: [
      "Your website no longer reflects the quality of your business.",
      "Visitors struggle to understand your offer or find the next step.",
      "You need a custom experience with room to grow.",
    ],
    deliverables: [
      [
        "Direction before decoration",
        "Page structure, audience priorities and a clear enquiry journey.",
      ],
      [
        "A visual system of your own",
        "Responsive layouts, type, color and purposeful interaction.",
      ],
      [
        "Production-ready development",
        "Accessible navigation, optimized assets and clear content structure.",
      ],
      [
        "Launch & ownership",
        "Device checks, essential metadata and a complete handover.",
      ],
    ],
    steps: [
      [
        "Map the journey",
        "Agree on the audience, pages, content and conversion goal.",
      ],
      [
        "Design the moments",
        "Explore the visual direction and prototype key journeys.",
      ],
      [
        "Build the experience",
        "Develop responsive pages and connect agreed integrations.",
      ],
      [
        "Check & launch",
        "Review devices, links and enquiry paths before handover.",
      ],
    ],
    questions: [
      [
        "Will it be a template?",
        "The visual direction and structure are designed around your business. We agree on the platform and any reusable components during scoping.",
      ],
      [
        "Can you help with copy?",
        "Yes. We can shape the page hierarchy, headlines and calls to action. Detailed copy and content production are agreed in the project scope.",
      ],
      [
        "Can I update it myself?",
        "If your team needs frequent edits, we can scope a content-management workflow and handover around the people who will use it.",
      ],
    ],
    projects: ["la-vallee-farms", "baby-steps", "lodhi-interiors"],
  },
  {
    slug: "ecommerce-shopify",
    title: "E-commerce & Shopify",
    short: "From product discovery to the next order.",
    heading: "Give good products",
    accent: "a better storefront.",
    intro:
      "A considered store makes it easier to choose, trust and buy. We build storefronts around product discovery, clear product information and the purchase journey—with retention integrations scoped alongside the build.",
    need: "E-commerce / Shopify",
    mode: "store",
    fit: [
      "Your storefront feels generic or hard to shop on mobile.",
      "Product pages leave important buying questions unanswered.",
      "You want store operations and customer follow-ups connected.",
    ],
    deliverables: [
      [
        "Storefront design",
        "Collections, product pages and responsive shopping experiences.",
      ],
      [
        "Product clarity",
        "Product information, trust details and a visible path to purchase.",
      ],
      [
        "Commerce setup",
        "Agreed payment, shipping, catalog and platform integrations.",
      ],
      [
        "Retention connections",
        "Scoped cart-recovery, WhatsApp and email workflows.",
      ],
    ],
    steps: [
      [
        "Understand the catalog",
        "Map products, customer questions and operational constraints.",
      ],
      [
        "Design the buying journey",
        "Prototype collection, product and purchase paths.",
      ],
      [
        "Connect the store",
        "Configure the storefront and agreed third-party tools.",
      ],
      [
        "Test real scenarios",
        "Review mobile shopping, checkout handoffs and order flows.",
      ],
    ],
    questions: [
      [
        "Do you only build Shopify stores?",
        "Shopify is one of our offerings. We recommend the platform after understanding your catalog and operations; the selected stack is part of the proposal.",
      ],
      [
        "Are platform and app fees included?",
        "Platform subscriptions, payment fees and third-party app costs are separate unless the proposal explicitly includes them.",
      ],
      [
        "Can you recover abandoned carts?",
        "We can scope recovery workflows using the capabilities and consent requirements of your chosen platform and channels. Recovery rates depend on the audience and offer.",
      ],
    ],
    projects: ["the-sugar-story", "shoolin-chemicals"],
  },
  {
    slug: "web-apps-saas",
    title: "Web apps & SaaS products",
    short: "From first prototype to a usable product.",
    heading: "Make the idea real.",
    accent: "Then make it useful.",
    intro:
      "Start with the smallest product that solves the right problem. We connect product design and engineering, so flows, data and architecture evolve together through clear milestones.",
    need: "SaaS product",
    mode: "product",
    fit: [
      "You have a product idea and need a focused first release.",
      "An existing product needs a clearer user experience.",
      "You need authentication, billing or integrations planned together.",
    ],
    deliverables: [
      [
        "Product definition",
        "User roles, core journeys and a prioritized first-release scope.",
      ],
      [
        "Interactive prototype",
        "Screens and flows to review before development.",
      ],
      [
        "Application engineering",
        "Data models, APIs and agreed auth, billing or account features.",
      ],
      [
        "Release & handover",
        "Testing, deployment guidance and maintainable ownership.",
      ],
    ],
    steps: [
      [
        "Define the first release",
        "Choose the core problem, user and essential features.",
      ],
      [
        "Prototype the workflow",
        "Validate navigation, states and edge cases together.",
      ],
      [
        "Build in milestones",
        "Deliver reviewable functionality in scoped increments.",
      ],
      [
        "Release & learn",
        "Launch the agreed scope and prioritize the next iteration.",
      ],
    ],
    questions: [
      [
        "Can you build an MVP?",
        "Yes. We start by separating essential flows from later features so the first release has a clear purpose and boundary.",
      ],
      [
        "Can you work with an existing codebase?",
        "We can review the current code and constraints before proposing an implementation. A technical review may be needed before estimating.",
      ],
      [
        "Who owns the software?",
        "Your code, data and infrastructure remain yours. Hosting and third-party subscriptions are scoped separately.",
      ],
    ],
    projects: [],
  },
  {
    slug: "ai-automation",
    title: "AI agents & workflow automation",
    short: "Connect the work between your tools.",
    heading: "Less repetitive work.",
    accent: "More room to think.",
    intro:
      "Map the manual steps that slow your team down, then connect them with practical automation. We design around real inputs, clear permissions and a human handoff when the workflow needs one.",
    need: "AI agents & automation",
    mode: "workflow",
    fit: [
      "Leads get copied between forms, spreadsheets and your CRM.",
      "Your team repeats the same follow-up or reporting tasks.",
      "You need an AI workflow with clear limits and oversight.",
    ],
    deliverables: [
      [
        "Workflow mapping",
        "Triggers, data sources, decision points and failure paths.",
      ],
      ["Connected tools", "Scoped CRM, forms, messaging and API integrations."],
      [
        "Useful AI steps",
        "Classification, qualification or extraction suited to the task.",
      ],
      [
        "Human handoff",
        "Review points, error handling and operating documentation.",
      ],
    ],
    steps: [
      [
        "Find the bottleneck",
        "Observe the workflow and define what can be automated.",
      ],
      [
        "Design the rules",
        "Map permissions, exceptions and human review points.",
      ],
      ["Connect & test", "Build integrations and test representative inputs."],
      [
        "Handover & monitor",
        "Document operations and agree how failures are handled.",
      ],
    ],
    questions: [
      [
        "Will AI replace our team?",
        "The goal is to remove repetitive steps and give people better information. Sensitive decisions and exceptions should stay with appropriate human owners.",
      ],
      [
        "Can you connect our existing tools?",
        "Often, yes—subject to the tools’ APIs, access permissions and subscription limits. We check these during scoping.",
      ],
      [
        "Are AI usage costs included?",
        "Model, messaging and platform usage fees are identified separately in the proposal.",
      ],
    ],
    projects: ["ai-buddies", "8flowlabs"],
  },
  {
    slug: "ai-chatbots",
    title: "AI chatbots & conversational experiences",
    short: "Useful conversations, with a clear handoff.",
    heading: "Answer the question.",
    accent: "Keep the conversation moving.",
    intro:
      "Build a helpful first point of contact for common questions, qualification and routing. We connect the conversation to approved business information and make the path to a person clear.",
    need: "AI chatbot",
    mode: "chat",
    fit: [
      "Your team repeatedly answers the same pre-sales questions.",
      "Website or WhatsApp enquiries need a better first response.",
      "You need a chatbot that knows when to hand over.",
    ],
    deliverables: [
      [
        "Conversation design",
        "Common questions, intents and boundaries for the assistant.",
      ],
      [
        "Knowledge setup",
        "Approved business information organized for useful responses.",
      ],
      [
        "Channel integration",
        "Website, WhatsApp or other agreed communication channels.",
      ],
      [
        "Escalation & review",
        "Human handoff, response testing and maintenance guidance.",
      ],
    ],
    steps: [
      [
        "Collect the real questions",
        "Identify the common requests and information sources.",
      ],
      [
        "Shape the conversation",
        "Write response boundaries and escalation rules.",
      ],
      ["Build the assistant", "Connect knowledge and the agreed channel."],
      [
        "Evaluate & refine",
        "Test unclear questions, missing information and handoffs.",
      ],
    ],
    questions: [
      [
        "Can it run on WhatsApp?",
        "We can scope WhatsApp integrations subject to account access, platform rules and messaging costs.",
      ],
      [
        "Will it always answer correctly?",
        "No AI system is perfect. Approved sources, testing, bounded responsibilities and a visible human handoff are part of a responsible implementation.",
      ],
      [
        "Can it book appointments?",
        "Booking can be included when your scheduling system supports the needed integration. We confirm this during discovery.",
      ],
    ],
    projects: ["8flowlabs"],
  },
  {
    slug: "business-systems",
    title: "Business systems & dashboards",
    short: "Software shaped around your operation.",
    heading: "Bring the moving parts",
    accent: "into one clear view.",
    intro:
      "Replace scattered workflows with software your team can actually use. We design internal tools, CRMs and dashboards around roles, data and everyday decisions.",
    need: "Business system (CRM/ERP/dashboard)",
    mode: "system",
    fit: [
      "Important information is scattered across spreadsheets.",
      "Teams lose context as work moves between departments.",
      "Reporting takes too much manual preparation.",
    ],
    deliverables: [
      [
        "Operational discovery",
        "Roles, existing tools and the flow of work and data.",
      ],
      [
        "Purpose-built interfaces",
        "Dashboards and task screens for the people doing the work.",
      ],
      [
        "Data & integrations",
        "Agreed data models, imports and API connections.",
      ],
      [
        "Access & handover",
        "Role-based access requirements and operating guidance.",
      ],
    ],
    steps: [
      [
        "Map operations",
        "Document the people, tasks and current data sources.",
      ],
      [
        "Design the workspace",
        "Prototype high-frequency actions and reporting views.",
      ],
      [
        "Build & connect",
        "Implement agreed roles, data and system integrations.",
      ],
      [
        "Roll out thoughtfully",
        "Validate with representative users and document the workflow.",
      ],
    ],
    questions: [
      [
        "Can this replace our spreadsheets?",
        "Where the workflow is stable enough, yes. We first identify which sheets should become structured software and which can remain useful supporting tools.",
      ],
      [
        "Can you migrate our data?",
        "Data migration can be scoped after reviewing formats, quality and access. Cleanup requirements affect effort and timing.",
      ],
      [
        "Can teams have different permissions?",
        "Yes. We define role and access requirements during discovery, then implement the agreed model.",
      ],
    ],
    projects: [],
  },
  {
    slug: "landing-pages",
    title: "Landing pages & campaign experiences",
    short: "One audience. One clear next step.",
    heading: "Turn the click",
    accent: "into a conversation.",
    intro:
      "Give every campaign a destination that continues the promise of the ad. We build focused landing pages around the audience, offer, proof and action you want visitors to take.",
    need: "Landing page",
    mode: "campaign",
    fit: [
      "Paid traffic is landing on a broad, unfocused homepage.",
      "You are launching a service, product, course or event.",
      "You need a page designed around one measurable action.",
    ],
    deliverables: [
      [
        "Offer & message hierarchy",
        "A clear promise, objection handling and a focused call to action.",
      ],
      [
        "Campaign-specific design",
        "A responsive experience that matches the campaign context.",
      ],
      [
        "Lead or purchase path",
        "Agreed form, booking, messaging or checkout integrations.",
      ],
      [
        "Measurement setup",
        "Defined conversion events and agreed analytics integrations.",
      ],
    ],
    steps: [
      [
        "Clarify the offer",
        "Choose the audience, campaign promise and primary action.",
      ],
      [
        "Structure the argument",
        "Sequence value, proof, objections and next steps.",
      ],
      [
        "Design & build",
        "Create a focused page with an efficient mobile journey.",
      ],
      [
        "Verify the handoff",
        "Check form delivery, campaign links and agreed tracking.",
      ],
    ],
    questions: [
      [
        "Can this work with Meta or Google campaigns?",
        "Yes. We can align the page with campaign messaging and agreed measurement. Campaign management is available through the connected Pixelcliq Media team.",
      ],
      [
        "Do you guarantee conversion rates?",
        "No. Results depend on the offer, traffic, market and experience. We define what to measure and build a foundation for testing.",
      ],
      [
        "Can we test more than one version?",
        "Yes. Variant design and experiment setup can be scoped if there is sufficient traffic and a clear testing question.",
      ],
    ],
    projects: ["dpm-entertainment", "ivy-estate"],
  },
  {
    slug: "website-redesign",
    title: "Website redesign & migration",
    short: "Move forward with a clear migration plan.",
    heading: "Keep what works.",
    accent: "Fix what holds you back.",
    intro:
      "Upgrade an outdated website without treating its existing content and search presence as an afterthought. We plan the experience, content mapping and migration together.",
    need: "Website redesign",
    mode: "redesign",
    fit: [
      "Your current site feels dated or hard to use on mobile.",
      "The business has evolved but the website has not.",
      "You need to change platforms and preserve important URLs.",
    ],
    deliverables: [
      [
        "Current-site review",
        "Content, journey and technical constraints before redesign.",
      ],
      [
        "Refined experience",
        "Updated hierarchy, visual direction and enquiry paths.",
      ],
      [
        "Migration mapping",
        "Inventory of important URLs, content and redirect requirements.",
      ],
      [
        "Launch checks",
        "Review redirects, metadata, links and key integrations.",
      ],
    ],
    steps: [
      [
        "Audit the starting point",
        "Identify important pages, traffic paths and existing issues.",
      ],
      [
        "Plan the move",
        "Agree on content, URL changes and technical responsibilities.",
      ],
      [
        "Design & rebuild",
        "Develop the new experience around the agreed priorities.",
      ],
      [
        "Launch & verify",
        "Check redirects, indexing signals and contact paths.",
      ],
    ],
    questions: [
      [
        "Can you preserve our rankings?",
        "No one can guarantee rankings. We plan redirects, content and technical signals to reduce avoidable migration risks, then check the launch.",
      ],
      [
        "Do we need to replace everything?",
        "No. We review what already serves users well and scope changes around the actual problems.",
      ],
      [
        "Can we keep our domain?",
        "Usually, yes. Domain, hosting and platform access requirements are clarified before migration.",
      ],
    ],
    projects: ["baby-steps", "apna-dental", "lodhi-interiors"],
  },
  {
    slug: "conversion-optimization",
    title: "Conversion rate optimization",
    short: "Improve the path from interest to action.",
    heading: "You earned the visit.",
    accent: "Make the next step clearer.",
    intro:
      "Find the friction between landing and taking action. We review page structure, user journeys and available evidence, then prioritize improvements you can measure.",
    need: "Conversion optimization",
    mode: "experiment",
    fit: [
      "People visit, but enquiries or purchases remain limited.",
      "Forms, booking paths or checkout handoffs feel cumbersome.",
      "You want a practical testing backlog instead of random changes.",
    ],
    deliverables: [
      [
        "Journey review",
        "A structured review of the route to your primary conversion.",
      ],
      [
        "Evidence & hypotheses",
        "Available analytics and usability findings separated from assumptions.",
      ],
      [
        "Prioritized improvements",
        "Copy, layout and flow changes ordered by practical value.",
      ],
      [
        "Measurement plan",
        "Events and experiment requirements appropriate to your traffic.",
      ],
    ],
    steps: [
      [
        "Define the action",
        "Choose the conversion and inspect available evidence.",
      ],
      [
        "Identify friction",
        "Review mobile usability, clarity and critical steps.",
      ],
      [
        "Make focused changes",
        "Implement the agreed improvements without changing everything.",
      ],
      [
        "Evaluate honestly",
        "Review signals and distinguish directional learning from proven results.",
      ],
    ],
    questions: [
      [
        "Do we need lots of traffic?",
        "A usability review can help at many traffic levels. Reliable A/B testing generally needs enough traffic and conversions; we assess whether a test is appropriate.",
      ],
      [
        "Do you promise an uplift?",
        "No. We prioritize evidence, form clear hypotheses and measure what changes without inventing a result.",
      ],
      [
        "Can you work with our existing site?",
        "Yes, subject to platform access and technical constraints. A rebuild is not automatically required.",
      ],
    ],
    projects: ["the-sugar-story", "dpm-entertainment"],
  },
  {
    slug: "website-care",
    title: "Website care & maintenance",
    short: "Keep a good website in good shape.",
    heading: "The launch is a milestone.",
    accent: "Not the last conversation.",
    intro:
      "Keep your website useful as content, dependencies and business needs change. We scope ongoing care around your platform, update needs and support expectations.",
    need: "Website care",
    mode: "care",
    fit: [
      "Your team needs a reliable point of contact after launch.",
      "Small changes and updates are getting delayed.",
      "You want maintenance responsibilities clearly defined.",
    ],
    deliverables: [
      [
        "Maintenance scope",
        "Agreed platform, responsibilities and support boundaries.",
      ],
      [
        "Updates & backups",
        "A maintenance and recovery approach suited to your stack.",
      ],
      [
        "Bug fixes & small edits",
        "An agreed allowance and workflow for routine changes.",
      ],
      [
        "Review & documentation",
        "Issue tracking, change records and escalation guidance.",
      ],
    ],
    steps: [
      [
        "Understand the stack",
        "Review hosting, platform, access and existing maintenance.",
      ],
      [
        "Agree the coverage",
        "Define responsibilities, exclusions and response expectations.",
      ],
      [
        "Maintain & improve",
        "Handle approved updates and requests through a clear workflow.",
      ],
      [
        "Review the next priorities",
        "Discuss recurring issues and larger changes separately.",
      ],
    ],
    questions: [
      [
        "Can you maintain a site someone else built?",
        "We can review the stack and access before accepting maintenance. A technical audit or cleanup may be needed first.",
      ],
      [
        "Is support available around the clock?",
        "Support hours and response expectations are defined in the agreement. We do not imply a 24/7 service unless it is explicitly scoped.",
      ],
      [
        "Are redesigns included?",
        "Major redesigns and new functionality are scoped separately from routine care unless included in your agreement.",
      ],
    ],
    projects: [],
  },
];
export const getService = (slug: string) =>
  STUDIO_SERVICES.find((s) => s.slug === slug);
