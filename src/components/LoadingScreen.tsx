import { useEffect, useRef, useState } from 'react'

type Phase = 'begin' | 'crossfade' | 'end' | 'fadeout' | 'done'

interface LoadingScreenProps {
  onFinished: () => void
}

// Sharpness + high-contrast filter applied to both media elements
const MEDIA_FILTER = 'contrast(1.7) saturate(1.4) brightness(1.08)'

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>('begin')
  const videoRef = useRef<HTMLVideoElement>(null)

  // ── Phase machine ──────────────────────────────────────────────────────────
  //  begin      → play begin.gif for ~2.2 s, then crossfade
  //  crossfade  → gif fades out / video fades in (0.8 s overlap)
  //  end        → video plays to finish
  //  fadeout    → whole overlay fades out
  //  done       → component removed

  useEffect(() => {
    if (phase !== 'begin') return
    const timer = setTimeout(() => setPhase('crossfade'), 2200)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'crossfade') return
    const vid = videoRef.current
    if (vid) {
      vid.playbackRate = 1.75
      vid.play().catch(() => {})
    }
    const timer = setTimeout(() => setPhase('end'), 800)
    return () => clearTimeout(timer)
  }, [phase])

  const handleVideoEnded = () => {
    if (phase === 'end' || phase === 'crossfade') setPhase('fadeout')
  }

  useEffect(() => {
    if (phase !== 'fadeout') return
    const timer = setTimeout(() => { setPhase('done'); onFinished() }, 900)
    return () => clearTimeout(timer)
  }, [phase, onFinished])

  useEffect(() => {
    if (phase === 'done' || phase === 'fadeout') return

    // Safety timeout: if we aren't done after 10s, force fadeout
    const safety = setTimeout(() => {
      console.warn('Loading safety timeout reached. Forcing fadeout.')
      setPhase('fadeout')
    }, 10000)

    return () => clearTimeout(safety)
  }, [phase])

  const [showSkip, setShowSkip] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (phase === 'done') return null

  const wrapperOpacity = phase === 'fadeout' ? 0 : 1
  const gifOpacity     = phase === 'begin' ? 1 : 0
  const videoOpacity   = phase === 'begin' ? 0 : 1

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: wrapperOpacity,
        transition: 'opacity 0.9s ease',
      }}
    >
      {/* ── Skip Button ───────────────────────────────────────────────── */}
      {showSkip && (
        <button
          onClick={() => setPhase('fadeout')}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: '10px',
            zIndex: 10000,
          }}
        >
          Skip Intro
        </button>
      )}

      {/* ── Shared media container — centred, constrained size ──────────── */}
      <div
        style={{
          position: 'relative',
          width: 'min(320px, 70vw)',
          height: 'min(320px, 45vh)',
        }}
      >
        {/* ── BEGIN GIF ─────────────────────────────────────────────────── */}
        <img
          src="/begin.gif"
          alt="Loading…"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: gifOpacity,
            transition: 'opacity 0.8s ease',
            filter: MEDIA_FILTER,
            imageRendering: 'crisp-edges',
            pointerEvents: 'none',
          }}
        />

        {/* ── END MP4 ───────────────────────────────────────────────────── */}
        <video
          ref={videoRef}
          src="/end.mp4"
          muted
          playsInline
          onEnded={handleVideoEnded}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: videoOpacity,
            transition: 'opacity 0.8s ease',
            filter: MEDIA_FILTER,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}
