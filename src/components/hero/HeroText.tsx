import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FiArrowRight, FiGithub, FiLinkedin, FiDownload, FiInstagram } from 'react-icons/fi'

const ROLES = ['Full-Stack Developer', '3D Web Creator', 'UI/UX Engineer', 'Open Source Contributor']

export default function HeroText() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLSpanElement>(null)

  /* ─── Entrance animation ─────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(
        '.h-badge',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
        .fromTo(
          '.h-line',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power4.out' },
          '-=0.2'
        )
        .fromTo(
          '.h-sub',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.h-cta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          '.h-scroll',
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.1'
        )
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  /* ─── Typewriter role cycle ──────────────────────────────────────────── */
  useEffect(() => {
    let idx = 0
    let charIdx = 0
    let isDeleting = false
    let timerId: ReturnType<typeof setTimeout>

    const tick = () => {
      const el = roleRef.current
      if (!el) return
      const current = ROLES[idx]

      if (isDeleting) {
        el.textContent = current.slice(0, charIdx - 1)
        charIdx--
      } else {
        el.textContent = current.slice(0, charIdx + 1)
        charIdx++
      }

      let speed = isDeleting ? 40 : 80
      if (!isDeleting && charIdx === current.length) {
        speed = 1800
        isDeleting = true
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false
        idx = (idx + 1) % ROLES.length
        speed = 400
      }
      timerId = setTimeout(tick, speed)
    }

    timerId = setTimeout(tick, 1200)
    return () => clearTimeout(timerId)
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative z-10 flex flex-col items-center text-center justify-center h-full max-w-3xl mx-auto px-6 md:px-14 lg:px-20"
    >
      <div className="h-badge flex flex-col items-center gap-4 mb-10" style={{ opacity: 0 }}>
        {/* Profile picture placeholder */}
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-violet-500/40 overflow-hidden relative shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:border-violet-400 transition-all duration-300">
          <img
            src="/profile.jpeg"
            alt="Arjit"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full shadow-sm dark:shadow-none">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse" />
          Available for freelance work
        </div>
      </div>

      {/* Heading */}
      <div className="overflow-hidden mb-1">
        <h1 className="h-line text-[clamp(3rem,7vw,6rem)] font-black text-slate-900 dark:text-white leading-[0.92] tracking-tight" style={{ opacity: 0 }}>
          Hi, I'm
        </h1>
      </div>
      <div className="overflow-hidden mb-1">
        <h1
          className="h-line text-[clamp(3rem,7vw,6rem)] font-black leading-[0.92] tracking-tight"
          style={{
            opacity: 0,
            background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Arjit
        </h1>
      </div>
      <div className="overflow-hidden mb-7">
        <h1 className="h-line text-[clamp(3rem,7vw,6rem)] font-black text-slate-900 dark:text-white leading-[0.92] tracking-tight" style={{ opacity: 0 }}>
          &amp; I build
        </h1>
      </div>

      {/* Typewriter */}
      <div className="h-sub flex items-center justify-center gap-3 mb-6" style={{ opacity: 0 }}>
        <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg font-medium min-h-[1.5em]">
          <span ref={roleRef} className="text-violet-600 dark:text-violet-300 font-semibold" />
          <span className="animate-pulse text-violet-500 dark:text-violet-400 ml-0.5">|</span>
        </p>
      </div>

      {/* Description */}
      <p className="h-sub text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-lg mx-auto" style={{ opacity: 0 }}>
        Crafting immersive, high-performance web experiences at the intersection
        of creative development and cutting-edge technology.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
        <a
          className="h-cta flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-95 shadow-sm dark:shadow-none"
          href="#work"
          style={{ opacity: 0 }}
        >
          View My Work <FiArrowRight />
        </a>
        <a
          className="h-cta flex items-center gap-2 border border-slate-200 dark:border-white/15 bg-white/60 dark:bg-white/5 backdrop-blur text-slate-900 dark:text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-slate-50 dark:hover:bg-violet-500/10 hover:-translate-y-0.5 active:scale-95 shadow-sm dark:shadow-none"
          href="#resume"
          style={{ opacity: 0 }}
        >
          Resume <FiDownload />
        </a>
      </div>

      {/* Social links */}
      <div className="flex justify-center items-center gap-3">
        {[
          { icon: FiGithub, href: 'https://github.com/arjit1809', label: 'GitHub' },
          { icon: FiLinkedin, href: 'https://www.linkedin.com/in/arjit-kumar-sahu-96a837362/', label: 'LinkedIn' },
          { icon: FiInstagram, href: 'https://www.instagram.com/arjit_1809?igsh=YmRqbTU2eDEwczg4', label: 'Instagram' },
        ].map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="h-cta w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-violet-400 dark:hover:border-violet-500/60 hover:bg-white dark:hover:bg-violet-500/15 transition-all duration-300 hover:-translate-y-0.5 shadow-sm dark:shadow-none"
            style={{ opacity: 0 }}
          >
            <Icon size={16} />
          </a>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="h-scroll absolute bottom-8 left-16 md:left-20 flex flex-col items-center gap-2" style={{ opacity: 0 }}>
        <span className="text-slate-500 dark:text-slate-600 text-xs tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
          scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-slate-400 dark:from-slate-600 to-transparent" />
      </div>
    </div>
  )
}
