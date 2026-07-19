import { NotFoundScene } from "@/components/motion/animkit/NotFoundScene";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-deep">
      <NotFoundScene />
      {/* Readability scrim over the dimmed scene */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-deep/85 via-deep/40 to-transparent"
      />
      <div className="container-site relative z-10 flex min-h-dvh flex-col items-start justify-center">
        <p className="font-mono text-micro uppercase tracking-[0.08em] text-muted">
          404
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-display-lg">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-6 max-w-md text-body-lg text-muted">
          The work does, though — it&rsquo;s all on the homepage.
        </p>
        <div className="mt-10">
          <Button href="/" size="lg">
            Back to the studio
          </Button>
        </div>
      </div>
    </main>
  );
}
