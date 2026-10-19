export function ProcessDiagram({
  stage,
  playing,
}: {
  stage: number;
  playing: boolean;
}) {
  return (
    <div
      className="process-demo process-demo-new"
      data-stage={stage}
      data-playing={playing}
      aria-hidden="true"
    >
      <div className="process-demo-top">
        <span>THE MAKING OF A WEBSITE</span>
        <b>0{stage + 1} / 04</b>
      </div>
      <div className="pd-scene">
        {stage === 0 && (
          <div className="pd-discover">
            <div className="pd-note pd-note-one">
              <span>01 / THE AUDIENCE</span>
              <strong>
                Who are we
                <br />
                <em>building for?</em>
              </strong>
              <i />
              <i />
            </div>
            <div className="pd-note pd-note-two">
              <span>02 / THE OBJECTIVE</span>
              <strong>
                What needs
                <br />
                <em>to happen?</em>
              </strong>
              <i />
              <i />
            </div>
            <svg viewBox="0 0 360 90">
              <path d="M80 0V30Q80 45 100 45H260Q280 45 280 30V0M180 45V90" />
            </svg>
            <div className="pd-direction">
              <i>↗</i>
              <div>
                <small>THE PROJECT BRIEF</small>
                <b>A shared direction.</b>
              </div>
              <span>✓</span>
            </div>
          </div>
        )}
        {stage === 1 && (
          <div className="pd-design">
            <div className="pd-design-browser">
              <div>
                <b>your brand.</b>
                <small>Discover / Contact ↗</small>
              </div>
              <section>
                <span>
                  Make it
                  <br />
                  <em>feel right.</em>
                </span>
                <i>
                  <b>Aa</b>
                </i>
              </section>
              <footer>
                <span />
                <span />
                <b>Let’s begin →</b>
              </footer>
            </div>
            <div className="pd-palette">
              <i />
              <i />
              <i />
              <span>ONE VISUAL LANGUAGE</span>
            </div>
            <span className="pd-review-cursor">
              ↖ <b>Design review</b>
            </span>
          </div>
        )}
        {stage === 2 && (
          <div className="pd-develop">
            <div className="pd-release-bar">
              <i />
              <span>WORKING PREVIEW</span>
              <b>BUILD / REVIEW / REFINE</b>
            </div>
            {[
              ["01", "Interface", "Responsive pages & interactions"],
              ["02", "Connections", "Forms, data & agreed integrations"],
              ["03", "Quality checks", "Devices, states & key journeys"],
            ].map(([n, t, d]) => (
              <div className="pd-build-layer" key={n}>
                <span>{n}</span>
                <div>
                  <b>{t}</b>
                  <small>{d}</small>
                </div>
                <i>✓</i>
              </div>
            ))}
            <div className="pd-build-line">
              <i />
            </div>
            <span className="pd-build-ready">
              A real product you can review ↗
            </span>
          </div>
        )}
        {stage === 3 && (
          <div className="pd-launch">
            <div className="pd-launch-orbit">
              <span>↗</span>
              <i />
              <i />
            </div>
            <strong>Your next chapter.</strong>
            <div>
              {[
                "Launch review",
                "Code & account ownership",
                "A clear handover",
              ].map((x, i) => (
                <span key={x} style={{ animationDelay: `${i * 0.4}s` }}>
                  <i>✓</i>
                  {x}
                </span>
              ))}
            </div>
            <small>BUILT. CHECKED. YOURS.</small>
          </div>
        )}
      </div>
      <span className="process-demo-bottom">
        {
          [
            "QUESTIONS → DIRECTION",
            "STRUCTURE → EXPERIENCE",
            "COMPONENTS → WORKING PRODUCT",
            "READY → OUT IN THE WORLD",
          ][stage]
        }
      </span>
    </div>
  );
}
