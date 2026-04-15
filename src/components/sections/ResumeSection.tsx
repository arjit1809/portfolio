import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiDownload, FiEye, FiX } from 'react-icons/fi'
import { scramble } from '../../utils/scramble'

gsap.registerPlugin(ScrollTrigger)

export default function ResumeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.resume-reveal',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showModal])

  return (
    <>
      <section id="resume" ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6 md:px-14 lg:px-20 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-sm dark:shadow-none">
          
          {/* Background ambient glow (dark mode) */}
          <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="resume-reveal flex items-center justify-center gap-3 mb-4" style={{ opacity: 0 }}>
              <div className="h-px w-8 bg-violet-500" />
              <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">Curriculum Vitae</span>
              <div className="h-px w-8 bg-violet-500" />
            </div>
            
            <h2 className="resume-reveal text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight" style={{ opacity: 0 }}>
              Grab My{' '}
              <span
                onMouseEnter={(e) => scramble(e.currentTarget)}
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Resume
              </span>
            </h2>
            
            <p className="resume-reveal text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed" style={{ opacity: 0 }}>
              Want to see my full professional background, complete skill set, and past experiences? 
              Download my latest resume to get all the details.
            </p>

            <div className="resume-reveal flex flex-col sm:flex-row items-center justify-center gap-4 mt-8" style={{ opacity: 0 }}>
              {/* Quick Look Button */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-violet-600 dark:border-violet-500 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 active:scale-95"
              >
                <FiEye size={20} />
                Quick Look
              </button>

              {/* Download Resume Button */}
              <a
                href="/resume.pdf"
                download="Arjit_Kumar_Sahu_Resume.pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 border-2 border-violet-600 hover:border-violet-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-95"
              >
                <FiDownload size={20} />
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Look Lightbox Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/95 dark:bg-[#050508]/95 backdrop-blur-xl p-4 md:p-12 transition-all duration-300"
          onClick={() => setShowModal(false)}
        >
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-600 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors p-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full z-50 shadow-sm dark:shadow-none"
            onClick={() => setShowModal(false)}
            title="Close image"
          >
            <FiX size={26} />
          </button>
          
          <img 
            src="/resume-pic.png" 
            alt="Resume Quick Look" 
            className="max-w-[95vw] max-h-[80vh] object-contain rounded-lg shadow-2xl dark:shadow-[0_0_50px_rgba(139,92,246,0.2)] border border-slate-200 dark:border-white/10 transition-transform duration-300 scale-100 mb-6"
            onClick={(e) => e.stopPropagation()} 
          />
          
          <p 
            className="text-slate-800 dark:text-slate-200 font-medium text-center max-w-lg bg-white/80 dark:bg-white/10 px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-violet-600 dark:text-violet-400 font-bold mr-1">Note:</span> 
            Click on download to view the full resume.
          </p>
        </div>
      )}
    </>
  )
}
