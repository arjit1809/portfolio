import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiCode, FiLayers, FiDatabase, FiSettings, FiLayout, FiCpu } from 'react-icons/fi'
import { scramble } from '../../utils/scramble'

gsap.registerPlugin(ScrollTrigger)

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    icon: FiCode,
    skills: [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'Java', level: 80 },
      { name: 'C', level: 85 },
    ]
  },
  {
    title: 'Frontend Development',
    icon: FiLayout,
    skills: [
      { name: 'React', level: 95 },
      { name: 'TailwindCSS', level: 95 },
      { name: 'Three.js', level: 80 },
      { name: 'Vite', level: 90 },
    ]
  },
  {
    title: 'Backend',
    icon: FiLayers,
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 85 },
    ]
  },
  {
    title: 'Database',
    icon: FiDatabase,
    skills: [
      { name: 'Supabase', level: 90 },
      { name: 'SQL', level: 85 },
      { name: 'PostgreSQL', level: 80 },
    ]
  },
  {
    title: 'Machine Learning',
    icon: FiCpu,
    skills: [
      { name: 'NumPy', level: 90 },
      { name: 'Pandas', level: 85 },
      { name: 'Scikit-learn', level: 80 },
    ]
  },
  {
    title: 'Tools & Ecosystem',
    icon: FiSettings,
    skills: [
      { name: 'Git / GitHub', level: 95 },
      { name: 'GSAP', level: 85 },
      { name: 'Figma', level: 80 },
    ]
  }
]

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal the whole block
      gsap.fromTo(
        '.skill-block-reveal',
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

      // Animate progress bars width
      gsap.fromTo(
        '.skill-progress-bar',
        { width: '0%' },
        {
          width: (_, el) => el.getAttribute('data-level') + '%',
          duration: 1.5,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="py-20 sm:py-32 px-4 sm:px-6 md:px-14 lg:px-20 max-w-7xl mx-auto">
      <div className="skill-block-reveal flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
        <div className="h-px w-8 bg-violet-500" />
        <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">Technical Arsenal</span>
      </div>
      
      <h2 className="skill-block-reveal text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-16 leading-tight" style={{ opacity: 0 }}>
        My{' '}
        <span 
          onMouseEnter={(e) => scramble(e.currentTarget)}
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Skills & Expertise
        </span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        {SKILL_CATEGORIES.map((category, idx) => (
          <div key={idx} className="skill-block-reveal relative" style={{ opacity: 0 }}>
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                <category.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{category.title}</h3>
            </div>

            {/* Skills List */}
            <div className="space-y-6">
              {category.skills.map((skill, sIdx) => (
                <div key={sIdx} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold tracking-wide text-sm md:text-base">
                      {skill.name}
                    </span>
                    <span className="text-violet-600 dark:text-violet-400 font-mono text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {skill.level}%
                    </span>
                  </div>
                  
                  {/* Progress Bar Track */}
                  <div className="relative h-3 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-300 dark:border-white/10 shadow-inner">
                    {/* Progress Fill */}
                    <div 
                      className="skill-progress-bar h-full rounded-full relative shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                      data-level={skill.level}
                      style={{ 
                        width: '0%', 
                        background: 'linear-gradient(90deg, #8b5cf6, #c084fc)'
                      }}
                    >
                      {/* Inner glow/shine effect */}
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite] transition-opacity duration-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
