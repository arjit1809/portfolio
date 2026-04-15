/**
 * useCustomCursor
 * ──────────────────────────────────────────────────────────────────────────
 * Production-ready custom cursor hook.
 * Manages:
 *  • Smooth inner dot + outer ring follower (RAF-driven easing)
 *  • Hover states: link / button / text / card / image
 *  • Magnetic attraction toward button elements
 *  • Click ripple / pulse burst
 *  • Trailing particle trail
 *  • Mobile/touch auto-disable
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

// ─── Types ────────────────────────────────────────────────────────────────

export type CursorState =
  | 'default'
  | 'link'
  | 'button'
  | 'text'
  | 'card'
  | 'image'

interface Vec2 { x: number; y: number }

interface TrailParticle {
  el: HTMLDivElement
  x: number
  y: number
  alpha: number
  scale: number
  life: number          // 0 → 1 (dead)
}

// ─── Constants ────────────────────────────────────────────────────────────

const OUTER_EASE        = 0.10   // follower lag (lower = slower/smoother)
const MAGNETIC_RADIUS   = 90     // px – distance at which magnetism kicks in
const MAGNETIC_STRENGTH = 0.35   // 0–1 pull intensity
const TRAIL_COUNT       = 12     // max simultaneous trail particles
const TRAIL_INTERVAL    = 40     // ms between spawning a new trail particle

// ─── Utility ─────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function isTouchDevice() {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useCustomCursor() {
  const innerRef  = useRef<HTMLDivElement | null>(null)
  const outerRef  = useRef<HTMLDivElement | null>(null)
  const labelRef  = useRef<HTMLDivElement | null>(null)
  const trailPool = useRef<TrailParticle[]>([])
  const rafId     = useRef<number>(0)
  const lastTrail = useRef<number>(0)

  // Raw mouse position
  const mouse  = useRef<Vec2>({ x: -200, y: -200 })
  // Smooth outer position
  const outer  = useRef<Vec2>({ x: -200, y: -200 })
  // Magnetic offset applied to outer
  const magOff = useRef<Vec2>({ x: 0, y: 0 })

  const cursorState = useRef<CursorState>('default')
  const isVisible   = useRef(false)

  // ── Trail pool initialisation ─────────────────────────────────────────

  const initTrail = useCallback(() => {
    const container = document.getElementById('cursor-trail-container')
    if (!container) return

    trailPool.current.forEach(p => p.el.remove())
    trailPool.current = []

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const el = document.createElement('div')
      el.className = 'cursor-trail-particle'
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, rgba(139,92,246,0.9) 0%, rgba(139,92,246,0) 80%);
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
        z-index: 9996;
        will-change: transform, opacity;
      `
      container.appendChild(el)
      trailPool.current.push({ el, x: -200, y: -200, alpha: 0, scale: 0, life: 1 })
    }
  }, [])

  // ── Spawn a trail particle at current mouse pos ───────────────────────

  const spawnTrail = useCallback((x: number, y: number) => {
    // Find a dead particle to recycle
    const p = trailPool.current.find(p => p.life >= 1)
    if (!p) return
    p.x = x
    p.y = y
    p.alpha = 0.85
    p.scale = 0.8 + Math.random() * 0.4
    p.life = 0
    p.el.style.left = `${x}px`
    p.el.style.top  = `${y}px`
  }, [])

  // ── Detect cursor state from hovered element ──────────────────────────

  const detectState = useCallback((el: Element | null): CursorState => {
    if (!el) return 'default'
    const tag = el.tagName.toLowerCase()
    const role = el.getAttribute('role') ?? ''

    // Walk up to 5 parents looking for meaningful selector
    let node: Element | null = el
    for (let i = 0; i < 5; i++) {
      if (!node) break
      const t = node.tagName.toLowerCase()
      const r = node.getAttribute('role') ?? ''
      const dc = node.getAttribute('data-cursor') as CursorState | null

      if (dc) return dc                                               // explicit override
      if (t === 'button' || r === 'button') return 'button'
      if (t === 'a') return 'link'
      if (node.classList.contains('cursor-card') ||
          node.classList.contains('work-card')   ||
          node.classList.contains('cert-card'))    return 'card'
      if (t === 'img' || node.classList.contains('cursor-image')) return 'image'
      node = node.parentElement
    }

    // Text node check
    if (['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
         'label', 'li', 'blockquote'].includes(tag) || role === 'text') {
      return 'text'
    }

    return 'default'
  }, [])

  // ── Apply visual state to DOM ─────────────────────────────────────────

  const applyState = useCallback((state: CursorState) => {
    const inner = innerRef.current
    const out   = outerRef.current
    const lbl   = labelRef.current
    if (!inner || !out || !lbl) return

    // Reset label
    lbl.textContent = ''
    lbl.style.opacity = '0'

    switch (state) {
      case 'button':
        inner.setAttribute('data-state', 'button')
        out.setAttribute('data-state',   'button')
        break
      case 'link':
        inner.setAttribute('data-state', 'link')
        out.setAttribute('data-state',   'link')
        break
      case 'text':
        inner.setAttribute('data-state', 'text')
        out.setAttribute('data-state',   'text')
        break
      case 'card':
        inner.setAttribute('data-state', 'card')
        out.setAttribute('data-state',   'card')
        lbl.textContent = 'View'
        lbl.style.opacity = '1'
        break
      case 'image':
        inner.setAttribute('data-state', 'image')
        out.setAttribute('data-state',   'image')
        lbl.textContent = 'Open'
        lbl.style.opacity = '1'
        break
      default:
        inner.setAttribute('data-state', 'default')
        out.setAttribute('data-state',   'default')
    }
  }, [])

  // ── Magnetic Pull ─────────────────────────────────────────────────────

  const updateMagnetic = useCallback((mx: number, my: number) => {
    const buttons = document.querySelectorAll<HTMLElement>(
      'button, a[href], [role="button"], [data-magnetic]'
    )
    let bestDx = 0, bestDy = 0, bestDist = Infinity

    buttons.forEach(btn => {
      const rect   = btn.getBoundingClientRect()
      const cx     = rect.left + rect.width  / 2
      const cy     = rect.top  + rect.height / 2
      const dist   = Math.hypot(mx - cx, my - cy)

      if (dist < MAGNETIC_RADIUS && dist < bestDist) {
        bestDist = dist
        const pull = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH
        bestDx = (cx - mx) * pull
        bestDy = (cy - my) * pull
      }
    })

    magOff.current = {
      x: lerp(magOff.current.x, bestDx, 0.12),
      y: lerp(magOff.current.y, bestDy, 0.12),
    }
  }, [])

  // ── Main RAF loop ─────────────────────────────────────────────────────

  // eslint-disable-next-line react-hooks/immutability
  const tick = useCallback((now: number) => {
    const mx = mouse.current.x
    const my = mouse.current.y

    // Update inner dot (instant)
    if (innerRef.current) {
      innerRef.current.style.transform =
        `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }

    // Update outer ring (lerped + magnetic)
    updateMagnetic(mx, my)
    outer.current.x = lerp(outer.current.x, mx + magOff.current.x, OUTER_EASE)
    outer.current.y = lerp(outer.current.y, my + magOff.current.y, OUTER_EASE)

    if (outerRef.current) {
      outerRef.current.style.transform =
        `translate(${outer.current.x}px, ${outer.current.y}px) translate(-50%, -50%)`
    }

    // Trail label follows outer
    if (labelRef.current) {
      labelRef.current.style.transform =
        `translate(${outer.current.x}px, ${outer.current.y}px) translate(-50%, -50%)`
    }

    // ── Trail particle decay ────────────────────────────────────────────
    if (now - lastTrail.current > TRAIL_INTERVAL) {
      spawnTrail(mx, my)
      lastTrail.current = now
    }

    trailPool.current.forEach(p => {
      if (p.life >= 1) return
      p.life  += 0.045
      p.alpha  = (1 - p.life) * 0.75
      p.scale  = (1 - p.life) * 0.9
      p.el.style.opacity   = p.alpha.toString()
      p.el.style.transform = `translate(-50%, -50%) scale(${p.scale})`
    })

    rafId.current = requestAnimationFrame(tick)
  }, [updateMagnetic, spawnTrail])

  // ── Click ripple ──────────────────────────────────────────────────────

  const spawnRipple = useCallback((x: number, y: number) => {
    const ripple = document.createElement('div')
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%);
      border: 1.5px solid rgba(139,92,246,0.7);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9995;
      animation: cursorRipple 0.6s cubic-bezier(.23,1,.32,1) forwards;
    `
    document.body.appendChild(ripple)
    setTimeout(() => ripple.remove(), 700)
  }, [])

  // ── Setup & Teardown ──────────────────────────────────────────────────

  useEffect(() => {
    if (isTouchDevice()) return   // No custom cursor on touch

    // Hide native cursor globally
    document.documentElement.style.cursor = 'none'

    initTrail()

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }

      if (!isVisible.current) {
        isVisible.current = true
        innerRef.current?.style.setProperty('opacity', '1')
        outerRef.current?.style.setProperty('opacity', '1')
        outer.current = { x: e.clientX, y: e.clientY }
      }

      // State detection
      const target     = document.elementFromPoint(e.clientX, e.clientY)
      const nextState  = detectState(target)
      if (nextState !== cursorState.current) {
        cursorState.current = nextState
        applyState(nextState)
      }

      // GSAP Element Magnetic Pull
      const btn = target?.closest('button, a[href], [role="button"], [data-magnetic]') as HTMLElement | null
      if (btn) {
        const rect = btn.getBoundingClientRect()
        const x = e.clientX - (rect.left + rect.width / 2)
        const y = e.clientY - (rect.top + rect.height / 2)
        gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' })
        btn.dataset.isHovered = 'true'
      }

      // Reset hover for elements we left
      document.querySelectorAll<HTMLElement>('[data-is-hovered="true"]').forEach(el => {
        if (el !== btn) {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' })
          delete el.dataset.isHovered
        }
      })
    }

    const onLeave = () => {
      innerRef.current?.style.setProperty('opacity', '0')
      outerRef.current?.style.setProperty('opacity', '0')
      isVisible.current = false
    }

    const onEnter = () => {
      if (!isVisible.current) return
      innerRef.current?.style.setProperty('opacity', '1')
      outerRef.current?.style.setProperty('opacity', '1')
    }

    const onClick = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY)
      // Scale burst on inner dot
      if (innerRef.current) {
        innerRef.current.classList.add('cursor-click')
        setTimeout(() => innerRef.current?.classList.remove('cursor-click'), 350)
      }
    }

    document.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })
    document.addEventListener('mouseenter', onEnter, { passive: true })
    document.addEventListener('click',      onClick, { passive: true })

    rafId.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('click',      onClick)
      cancelAnimationFrame(rafId.current)
      document.documentElement.style.cursor = ''
      trailPool.current.forEach(p => p.el.remove())
    }
  }, [tick, initTrail, detectState, applyState, spawnRipple])

  return { innerRef, outerRef, labelRef }
}
