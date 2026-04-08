import { useEffect, useState, useCallback } from 'react'
import { FiArrowUp } from 'react-icons/fi'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to top"
      data-cursor="button"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '1.5rem',
        zIndex: 9990,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '1.5px solid',
        borderColor: hovered ? 'rgba(196, 165, 255, 0.8)' : 'rgba(124, 58, 237, 0.45)',
        background: hovered
          ? 'rgba(109, 40, 217, 0.92)'
          : 'rgba(109, 40, 217, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: hovered
          ? '0 0 28px rgba(139, 92, 246, 0.65), 0 0 6px rgba(139, 92, 246, 0.4)'
          : '0 0 14px rgba(139, 92, 246, 0.35)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        /* Visibility transition */
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered ? 'translateY(-4px) scale(1.08)' : 'translateY(0) scale(1)'
          : 'translateY(20px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
        transition:
          'opacity 0.35s ease, transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Animated arrow */}
      <span
        style={{
          display: 'flex',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.25s ease',
        }}
      >
        <FiArrowUp size={20} strokeWidth={2.5} />
      </span>

      {/* Pulse ring on hover */}
      {hovered && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(196, 165, 255, 0.55)',
            animation: 'bttPulse 0.8s ease-out infinite',
          }}
        />
      )}

      <style>{`
        @keyframes bttPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.55); opacity: 0; }
        }
      `}</style>
    </button>
  )
}
