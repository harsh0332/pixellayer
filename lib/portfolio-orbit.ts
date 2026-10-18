/** A short reading hold, then an eased move to the next project. */
export function orbitPosition(progress: number, count: number) {
  const travel = Math.max(0, Math.min(1, progress)) * (count - 1 + 0.55);
  const index = Math.floor(travel);
  const phase = Math.max(0, Math.min(1, (travel - index - 0.35) / 0.65));
  const eased = phase * phase * (3 - 2 * phase);
  return Math.min(count - 1, index + eased);
}

export function orbitCardPose(distance: number, width: number, height: number) {
  const angle = Math.max(-2.4, Math.min(2.4, distance)) * 0.9;
  const depth = Math.min(2, Math.abs(distance));
  return {
    x: Math.sin(angle) * width * 0.59,
    y: (1 - Math.cos(angle)) * height * 0.35 + distance * 16,
    rotate: distance * 12,
    rotateY: distance * -16,
    scale: 1 - depth * 0.18,
    opacity: Math.max(0, 1 - Math.max(0, depth - 0.5) * 0.7),
    zIndex: 100 - Math.round(depth * 30),
  };
}
