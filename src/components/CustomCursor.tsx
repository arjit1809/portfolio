/**
 * CustomCursor
 * ──────────────────────────────────────────────────────────────────────────
 * Renders the three cursor DOM nodes:
 *  1. #cursor-inner  – the fast-moving core dot
 *  2. #cursor-outer  – the lagging glass ring
 *  3. #cursor-label  – the "View / Open" text badge
 *  4. #cursor-trail-container – portal for trail particles (managed by hook)
 *
 * Mount this once at the top of your app — it lives outside the normal
 * stacking context via fixed positioning & high z-index.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useCustomCursor } from '../hooks/useCustomCursor'

export default function CustomCursor() {
  const { innerRef, outerRef, labelRef } = useCustomCursor()

  return (
    <>
      {/* ── Trail particle container ──────────────────────────────────── */}
      <div id="cursor-trail-container" aria-hidden="true" />

      {/* ── Outer ring / follower ─────────────────────────────────────── */}
      <div
        id="cursor-outer"
        ref={outerRef}
        data-state="default"
        aria-hidden="true"
      />

      {/* ── Inner dot ────────────────────────────────────────────────── */}
      <div
        id="cursor-inner"
        ref={innerRef}
        data-state="default"
        aria-hidden="true"
      />

      {/* ── Label badge ──────────────────────────────────────────────── */}
      <div
        id="cursor-label"
        ref={labelRef}
        aria-hidden="true"
      />
    </>
  )
}
