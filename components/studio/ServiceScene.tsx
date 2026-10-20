"use client";
import type { ServiceMode } from "@/lib/services";
import { useSequence } from "./StudioMotion";
const LABELS: Record<ServiceMode, [string, string]> = {
  design: ["Wireframe", "Visual design"],
  store: ["Discover", "Product detail"],
  product: ["Overview", "Project view"],
  workflow: ["Manual steps", "Connected flow"],
  chat: ["Question", "Helpful response"],
  system: ["Scattered tools", "One workspace"],
  campaign: ["The promise", "The next step"],
  redesign: ["Starting point", "New direction"],
  experiment: ["More friction", "Clearer next step"],
  care: ["Review", "Care checklist"],
};
const STORY: Record<
  ServiceMode,
  { name: string; steps: string[]; notes: [string, string] }
> = {
  design: {
    name: "Website design",
    steps: ["Structure", "Visual system", "Clear action"],
    notes: [
      "First, make the information easy to follow. Give every page one clear job.",
      "Then bring the brand to life, with visual hierarchy that leads to the next step.",
    ],
  },
  store: {
    name: "E-commerce",
    steps: ["Discover", "Understand", "Buy"],
    notes: [
      "Help the customer find the right product through useful collections and navigation.",
      "Answer buying questions at the product page, then make the next action easy to find.",
    ],
  },
  product: {
    name: "Product design",
    steps: ["Priorities", "Useful flows", "Working product"],
    notes: [
      "Start with the tasks people need to complete, not an endless list of features.",
      "Keep context, progress and the next action together inside the product.",
    ],
  },
  workflow: {
    name: "AI automation",
    steps: ["Trigger", "Route", "Human handoff"],
    notes: [
      "Find the repeated handoffs that leave your team copying data between tools.",
      "Connect the agreed steps, preserve context and keep people in control of decisions.",
    ],
  },
  chat: {
    name: "AI assistants",
    steps: ["Understand", "Help", "Hand over"],
    notes: [
      "Understand the question and retrieve the relevant approved information.",
      "Offer a useful next step and a clear route to a person when the conversation needs one.",
    ],
  },
  system: {
    name: "Business systems",
    steps: ["Shared data", "Clear roles", "One view"],
    notes: [
      "Map the tools, permissions and information your team relies on every day.",
      "Bring the relevant work into one view, with ownership and handoffs made visible.",
    ],
  },
  campaign: {
    name: "Landing pages",
    steps: ["Promise", "Proof", "Action"],
    notes: [
      "Start with the specific promise your visitor saw before clicking.",
      "Continue that same story with relevant proof, useful details and one clear action.",
    ],
  },
  redesign: {
    name: "Website redesign",
    steps: ["Audit", "Rebuild", "Migrate"],
    notes: [
      "Understand what the current site needs to keep and where the journey breaks down.",
      "Build a stronger direction around the content and customer paths that matter.",
    ],
  },
  experiment: {
    name: "Conversion improvement",
    steps: ["Observe", "Hypothesize", "Validate"],
    notes: [
      "Review the decisions, questions and unnecessary fields in a real customer journey.",
      "Try a simpler path, then validate whether it helps with real behavior and evidence.",
    ],
  },
  care: {
    name: "Website care",
    steps: ["Review", "Maintain", "Verify"],
    notes: [
      "Regularly review the platform, content and paths your customers depend on.",
      "Apply agreed changes, check the important journeys and document what was done.",
    ],
  },
};
export function ServiceScene({ mode }: { mode: ServiceMode }) {
  const {
    active: view,
    playing,
    ref,
    choose,
    setHover,
    setFocused,
  } = useSequence(2, 6200);
  const story = STORY[mode];
  return (
    <div
      ref={ref}
      className={`service-scene service-scene-live service-scene-${mode} ${view ? "scene-refined" : "scene-raw"}`}
      data-scene-playing={playing}
      role="group"
      aria-label={`${story.name} illustrated walkthrough`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="service-scene-top">
        <span>THE EXPERIENCE / IN MOTION</span>
        <span className="service-scene-status">
          <i aria-hidden="true" />
          {playing ? "PLAYING" : "EXPLORE AT YOUR PACE"}
        </span>
      </div>
      <div className="service-story-track" aria-label="The customer journey">
        {story.steps.map((step, index) => (
          <span key={step}>
            <i aria-hidden="true">0{index + 1}</i>
            {step}
          </span>
        ))}
      </div>
      <div className="service-scene-stage" key={view}>
        {(mode === "design" || mode === "redesign") && (
          <div className="service-mini-browser">
            <div>
              ● ● ● <span>your-next-chapter.site</span>
            </div>
            <article>
              <small>YOUR BRAND / REIMAGINED</small>
              <h3>
                {view ? (
                  <>
                    A better
                    <br />
                    <em>first impression.</em>
                  </>
                ) : (
                  <>
                    A clear
                    <br />
                    <em>starting point.</em>
                  </>
                )}
              </h3>
              <span className="scene-abstract">
                <i />
                <i />
                <i />
              </span>
              <p>
                {view
                  ? "Thoughtful hierarchy. A clear next step."
                  : "Headline · Image · Content · Action"}
              </p>
              <b>{view ? "Let’s talk ↗" : "Call to action"}</b>
            </article>
          </div>
        )}
        {mode === "store" && (
          <div className="scene-store">
            <span className="scene-store-brand">
              everyday<span>®</span>
              <small>{view ? "PRODUCT / 001" : "THE COLLECTION"}</small>
            </span>
            <div className="scene-product-illustration">
              <span />
              <i />
            </div>
            <div>
              <small>MADE FOR EVERY DAY</small>
              <h3>{view ? "The considered carry." : "Find your everyday."}</h3>
              <p>
                {view
                  ? "Materials. Dimensions. Delivery. The details that help a customer decide."
                  : "A considered collection, with a clear path to the right product."}
              </p>
              <span className="scene-product-action">
                {view ? "Add to bag +" : "Explore the collection ↗"}
              </span>
            </div>
          </div>
        )}
        {(mode === "product" || mode === "system") && (
          <div className="scene-dashboard">
            <aside>
              <b>
                workroom<span>®</span>
              </b>
              {["Overview", "Projects", "People", "Settings"].map((x, i) => (
                <span key={x} className={i === view ? "active" : ""}>
                  {x}
                </span>
              ))}
            </aside>
            <div>
              <small>YOUR WORKSPACE</small>
              <h3>
                {mode === "system"
                  ? view
                    ? "Everything in view."
                    : "Too many places."
                  : view
                    ? "The next release."
                    : "A clearer overview."}
              </h3>
              <div className="scene-dashboard-tabs">
                <span>Planning</span>
                <span>In progress</span>
                <span>Review</span>
              </div>
              <div className="scene-kanban">
                {[
                  "Project brief",
                  "Design review",
                  "Integration",
                  "Release checklist",
                ].map((x, i) => (
                  <span key={x} style={{ animationDelay: `${i * 110}ms` }}>
                    <i />
                    {x}
                    <small>
                      {view ? "CONNECTED WORKFLOW" : "SEPARATE TASK"}
                    </small>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {mode === "workflow" && (
          <div className="scene-workflow">
            <span className="scene-flow-label">
              {view ? "ONE CONNECTED JOURNEY" : "THE EVERYDAY BOTTLENECK"}
            </span>
            {(view
              ? [
                  "New enquiry",
                  "AI qualification",
                  "CRM handoff",
                  "Human follow-up",
                ]
              : [
                  "Copy enquiry",
                  "Update spreadsheet",
                  "Find the context",
                  "Send a reminder",
                ]
            ).map((x, i) => (
              <div key={x} style={{ animationDelay: `${i * 130}ms` }}>
                <b>{["↗", "✳", "▦", "✓"][i]}</b>
                <span>{x}</span>
                <small>{view ? "CONNECTED" : "MANUAL"}</small>
              </div>
            ))}
          </div>
        )}
        {mode === "chat" && (
          <div className="scene-chat">
            <header>
              <span>✳</span>
              <div>
                <b>Your brand assistant</b>
                <small>APPROVED KNOWLEDGE · HUMAN HANDOFF</small>
              </div>
            </header>
            <p className="scene-chat-user">Can I book a consultation?</p>
            {view ? (
              <>
                <p className="scene-chat-answer">
                  I can help you find the right next step. Would you like to see
                  the booking options or speak with the team?
                </p>
                <div>
                  <span>View booking options ↗</span>
                  <span>Talk to a person ↗</span>
                </div>
              </>
            ) : (
              <p className="scene-chat-thinking">
                <i />
                <i />
                <i />
                <span>Finding the relevant information</span>
              </p>
            )}
          </div>
        )}
        {mode === "campaign" && (
          <div className="scene-campaign">
            <div className="scene-ad">
              <small>CAMPAIGN PROMISE</small>
              <h3>
                Make room
                <br />
                for <em>what’s next.</em>
              </h3>
              <span>Discover more ↗</span>
            </div>
            <span className="scene-campaign-arrow">→</span>
            <div className="scene-landing">
              <small>
                {view ? "MATCHING LANDING PAGE" : "A CLEAR CONTINUATION"}
              </small>
              <h3>
                Your next
                <br />
                <em>chapter starts here.</em>
              </h3>
              <p>A specific offer. Relevant proof. One clear action.</p>
              <b>Book a conversation ↗</b>
            </div>
          </div>
        )}
        {mode === "experiment" && (
          <div className="scene-experiment">
            <small>
              {view ? "REMOVE UNNECESSARY DECISIONS" : "REVIEW THE FRICTION"}
            </small>
            <h3>Let’s start a conversation.</h3>
            <div className="scene-form-fields">
              {(view
                ? ["Your name", "Work email", "What are you building?"]
                : [
                    "Your name",
                    "Work email",
                    "Phone number",
                    "Job title",
                    "Company size",
                    "Postal address",
                    "What are you building?",
                  ]
              ).map((f) => (
                <span key={f}>
                  {f}
                  <i />
                </span>
              ))}
            </div>
            <b>{view ? "Discuss my project ↗" : "Submit"}</b>
            <p>
              Illustrative simplification. Validate changes with real users and
              data.
            </p>
          </div>
        )}
        {mode === "care" && (
          <div className="scene-care">
            <div className="scene-care-orbit">
              <span>✳</span>
            </div>
            <small>A WEBSITE WORTH LOOKING AFTER</small>
            <h3>
              {view
                ? "Keep the details in shape."
                : "Know what needs attention."}
            </h3>
            {[
              "Platform updates",
              "Backup & recovery",
              "Content requests",
              "Critical user journeys",
            ].map((x, i) => (
              <div key={x} style={{ animationDelay: `${i * 120}ms` }}>
                <span>{x}</span>
                <b>{view ? "✓" : "○"}</b>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className="service-scene-controls"
        role="group"
        aria-label="Explore the service illustration"
      >
        {LABELS[mode].map((label, i) => (
          <button
            type="button"
            key={label}
            aria-pressed={view === i}
            onClick={() => choose(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="service-scene-explainer">{story.notes[view]}</p>
      <p className="service-scene-note">
        ILLUSTRATIVE DEMO · NOT A LIVE CUSTOMER SYSTEM
      </p>
    </div>
  );
}
