import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiBookOpen, FiAward } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const EDUCATION = [
  {
    period: 'Present',
    degree: 'Bachelors Degree',
    institution: 'Currently Pursuing',
    description: 'Focusing on computer science fundamentals, software engineering, and modern web technologies.',
    icon: FiBookOpen,
  },
  {
    period: 'Completed',
    degree: '10+2 (Higher Secondary)',
    institution: 'CBSE Board',
    description: 'Completed higher secondary education with a strong foundation in science and mathematics.',
    icon: FiAward,
  },
]

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.edu-reveal',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="education" ref={sectionRef} className="py-32 px-6 md:px-14 lg:px-20 max-w-7xl mx-auto">
      <div className="edu-reveal flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
        <div className="h-px w-8 bg-violet-500" />
        <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">Academic Journey</span>
      </div>
      
      <h2 className="edu-reveal text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-16 leading-tight" style={{ opacity: 0 }}>
        My{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Education
        </span>
      </h2>

      <div className="relative border-l border-violet-200 dark:border-white/10 ml-4 md:ml-6 space-y-12">
        {EDUCATION.map((item, i) => (
          <div key={i} className="edu-reveal relative pl-8 md:pl-12" style={{ opacity: 0 }}>
            {/* Timeline Dot */}
            <div className="absolute -left-[18px] top-1 w-9 h-9 rounded-full bg-slate-50 dark:bg-[#050508] border border-violet-500/30 flex items-center justify-center text-violet-500 dark:text-violet-400">
              <item.icon size={16} />
            </div>

            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 hover:border-violet-500/30 transition-colors shadow-sm dark:shadow-none">
              <span className="inline-block px-3 py-1 bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-full mb-4">
                {item.period}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{item.degree}</h3>
              <p className="text-violet-600 dark:text-violet-400 font-medium mb-4">{item.institution}</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
