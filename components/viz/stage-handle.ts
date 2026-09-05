/**
 * The imperative surface a canvas stage exposes to its shell.
 *
 * `MoleculeStage` and `NetworkStage` own their own rotation/zoom state in a
 * ref (it changes every frame, so it can't be React state). Before this,
 * nothing outside the canvas could reach it — which is why neither stage could
 * offer a Reset or Zoom control, and why the only way to move either one was a
 * mouse drag or a wheel: no keyboard path at all.
 */
export interface StageHandle {
  /** Return to the stage's initial orientation and zoom. */
  reset(): void;
  /** Multiply zoom, clamped to the stage's own limits. */
  zoomBy(factor: number): void;
  /** Rotate by radians — the keyboard path onto the same state a drag drives. */
  rotateBy(dx: number, dy: number): void;
}
