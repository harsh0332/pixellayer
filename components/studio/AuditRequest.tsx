"use client";
import { useState } from "react";
const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP ?? "917024332332").replace(
  /\D/g,
  "",
);
export function AuditRequest() {
  const [url, setUrl] = useState(""),
    [goal, setGoal] = useState("More enquiries"),
    [error, setError] = useState(""),
    [ready, setReady] = useState("");
  return (
    <form
      className="studio-audit-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setReady("");
        try {
          const parsed = new URL(url.trim());
          if (
            !["http:", "https:"].includes(parsed.protocol) ||
            parsed.username ||
            parsed.password
          ) throw new Error();
          const text = `Hi PixelLayerr, I’d like a free website audit.\nWebsite: ${parsed.href}\nMain goal: ${goal}\nPlease review the user journey, message clarity and technical basics.`;
          setReady(
            `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,
          );
          setError("");
        } catch {
          setError("Enter a full website URL, including https://.");
        }
      }}
    >
      <h2>Let’s see where you are.</h2>
      <p>
        This prepares a request for our team. Your website is not scanned
        automatically.
      </p>
      <label htmlFor="audit-url">
        Your website <span>(required)</span>
      </label>
      <input
        id="audit-url"
        type="url"
        required
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setReady("");
          setError("");
        }}
        placeholder="https://yourwebsite.com"
        aria-invalid={!!error}
        aria-describedby={error ? "audit-error" : undefined}
      />
      {error && (
        <p id="audit-error" className="studio-form-error" role="alert">
          {error}
        </p>
      )}
      <label htmlFor="audit-goal">What would you like to improve?</label>
      <select
        id="audit-goal"
        value={goal}
        onChange={(e) => {
          setGoal(e.target.value);
          setReady("");
        }}
      >
        {[
          "More enquiries",
          "Online sales",
          "Mobile experience",
          "Clarity & messaging",
          "Speed & technical basics",
          "Not sure yet",
        ].map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <button type="submit" className="eco-action">
        Prepare my audit request <span>↗</span>
      </button>
      <small>No sign-up required. You choose when to send it.</small>
      <div aria-live="polite">
        {ready && (
          <div className="studio-audit-ready">
            <h3>Your request is ready.</h3>
            <p>
              Open WhatsApp to review and send it to the PixelLayerr team.
              Nothing has been submitted yet.
            </p>
            <a
              href={ready}
              target="_blank"
              rel="noopener noreferrer"
              className="eco-action"
            >
              Open WhatsApp with request <span>↗</span>
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
