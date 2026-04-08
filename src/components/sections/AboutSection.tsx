import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  { category: 'Core Web Magic', items: ['HTML5', 'Modern CSS3', 'JavaScript (ES6+)'] },
  { category: 'Logic & Data Vault', items: ['Python', 'Advanced DBMS', 'SQL'] },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

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

      // Skill tags pop in
      gsap.fromTo(
        '.skill-tag',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.skills-wrapper',
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 sm:py-32 px-4 sm:px-6 md:px-14 lg:px-20 max-w-7xl mx-auto">

      {/* ─── PERSONAL INFO SECTION ─── */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-12 mb-24">
        {/* Left Side: Text Content */}
        <div className="flex-1 max-w-3xl flex flex-col justify-center">
          <div className="about-reveal flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
            <div className="h-px w-8 bg-violet-500" />
            <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">Personal Info</span>
          </div>

          <h2 className="about-reveal text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight" style={{ opacity: 0 }}>
            Turning ideas into{' '}
            <span
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
            I'm a developer passionate about pushing the boundaries of what's possible on the web.
            I specialize in building performant, visually stunning applications that leave a lasting impression.
          </p>
          <p className="about-reveal text-slate-600 dark:text-slate-400 leading-relaxed" style={{ opacity: 0 }}>
            When I'm not shipping code, I'm exploring generative art, contributing to open-source,
            or experimenting with new technologies. I believe the best products sit at the intersection
            of technical excellence and design obsession.
          </p>
        </div>

        {/* Right Side: Running Man Video */}
        <div className="about-reveal hidden lg:flex relative w-full lg:w-[400px] xl:w-[450px] items-stretch justify-end pointer-events-none rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg dark:shadow-[0_0_30px_rgba(139,92,246,0.15)] bg-slate-50 dark:bg-[#050508]" style={{ opacity: 0 }}>
          {/* Light Theme Video */}
          <video
            src="/running.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center block dark:hidden"
          />
          {/* Dark Theme Video */}
          <video
            src="/running-black.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center hidden dark:block"
          />
        </div>
      </div>

      {/* ─── SKILLS SECTION ─── */}
      <div className="skills-wrapper">
        <div className="about-reveal flex items-center gap-3 mb-8" style={{ opacity: 0 }}>
          <div className="h-px w-8 bg-violet-500" />
          <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">My Skills</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {SKILLS.map(({ category, items }) => (
            <div key={category} className="about-reveal rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 hover:border-violet-300 dark:hover:border-violet-500/30 transition-colors shadow-sm dark:shadow-none" style={{ opacity: 0 }}>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg tracking-wider mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag text-sm font-semibold px-4 py-2 rounded-xl border border-violet-200 dark:border-violet-500/25 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:border-violet-400 dark:hover:border-violet-400/80 hover:bg-violet-100 dark:hover:bg-violet-500/30 hover:text-violet-900 dark:hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] dark:hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300 cursor-default"
                    style={{ opacity: 0 }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
