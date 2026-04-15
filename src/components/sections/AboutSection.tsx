import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scramble } from '../../utils/scramble'

gsap.registerPlugin(ScrollTrigger)



export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-reveal',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)

    // Force play for iOS Low Power Mode
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Silently catch autoplay block
      })
    }
    
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 sm:py-32 px-4 sm:px-6 md:px-14 lg:px-20 max-w-7xl mx-auto">

      {/* ─── PERSONAL INFO SECTION ─── */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
        {/* Left Side: Text Content */}
        <div className="flex-1 max-w-3xl flex flex-col justify-center">
          <div className="about-reveal flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
            <div className="h-px w-8 bg-violet-500" />
            <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">Personal Info</span>
          </div>

          <h2 className="about-reveal text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight" style={{ opacity: 0 }}>
            Turning ideas into{' '}
            <span
              onMouseEnter={(e) => scramble(e.currentTarget)}
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              digital reality
            </span>
          </h2>
          <p className="about-reveal text-slate-600 dark:text-slate-400 leading-relaxed mb-5" style={{ opacity: 0 }}>
            I'm a 2nd-year AI/ML student at Lovely Professional University, passionate about pushing the boundaries of what's possible on the web. I specialize in building performant, visually stunning applications that leave a lasting impression.
          </p>
          <p className="about-reveal text-slate-600 dark:text-slate-400 leading-relaxed mb-6" style={{ opacity: 0 }}>
            Beyond writing code, I have a deep interest in entrepreneurship—whether it's building hostel-focused products to solve daily student problems or managing events that bring people together. I believe the best products sit at the intersection of technical excellence, user empathy, and design obsession.
          </p>

          <div className="about-reveal bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-xl p-5" style={{ opacity: 0 }}>
            <h4 className="text-violet-700 dark:text-violet-300 font-semibold mb-2 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
              </span>
              Currently Building
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              Exploring the frontiers of AI integration and building intuitive, design-forward SaaS applications tailored for college life and beyond.
            </p>
          </div>
        </div>

        {/* Right Side: Visionary Alive Video */}
        <div className="about-reveal flex w-full lg:w-[400px] xl:w-[450px] justify-center lg:justify-end mt-12 lg:mt-0" style={{ opacity: 0 }}>
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl dark:shadow-[0_0_40px_rgba(139,92,246,0.3)] border border-violet-100 dark:border-violet-500/20 bg-slate-50 dark:bg-[#050508] animate-float group transition-transform duration-500 hover:scale-[1.02]">
            {/* Alive pulse/glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-indigo-500/10 mix-blend-overlay z-10 pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity duration-300 animate-pulse"></div>
            
            <video
              ref={videoRef}
              src="/og.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto aspect-video sm:aspect-auto object-cover sm:object-contain block relative z-0 rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
