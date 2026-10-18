/** Hold each website for reading, then reveal the next upward inside one frame. */
export function revealPosition(progress: number, count: number) {
  const travel = Math.max(0, Math.min(1, progress)) * (count - 1 + 0.55);
  const index = Math.floor(travel);
  const phase = Math.max(0, Math.min(1, (travel - index - 0.35) / 0.65));
  return Math.min(count - 1, index + phase * phase * (3 - 2 * phase));
}
export function revealPose(index: number, position: number) {
  const current = Math.floor(position);
  const phase = position - current;
  return {
    visible: index === current || index === current + 1,
    inset: index === current + 1 ? (1 - phase) * 100 : 0,
    y: index === current ? -phase * 18 : (1 - phase) * 24,
    scale: index === current ? 1 - phase * 0.035 : 1,
    zIndex: index === current + 1 ? 2 : 1,
  };
}
