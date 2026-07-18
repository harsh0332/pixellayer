/** Phase-3 scaffold marker — deleted as real section content lands. */
export function PlaceholderBlock({ note }: { note: string }) {
  return (
    <div className="rounded-lg border border-dashed border-hairline-strong bg-surface p-6 sm:p-8">
      <p className="max-w-xl text-small text-muted">{note}</p>
    </div>
  );
}
