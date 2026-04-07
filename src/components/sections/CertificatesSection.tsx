import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiX } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const CERTIFICATES = [
  { id: 1, image: '/certificate-1.png' },
  { id: 2, image: '/certificate-2.png' },
  { id: 3, image: '/certificate-3.png' },
]

export default function CertificatesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cert-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        '.cert-slot',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.certs-grid', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedImage])

  return (
    <>
      <section id="certificates" ref={sectionRef} className="py-32 px-6 md:px-14 lg:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="cert-header flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
          <div className="h-px w-8 bg-violet-500" />
          <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">Achievements</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <h2 className="cert-header text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight" style={{ opacity: 0 }}>
            My{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Certificates
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="certs-grid grid md:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert) => (
            <div 
              key={cert.id} 
              data-cursor="card"
              className="cert-slot relative group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-[4/3] bg-white dark:bg-black/40 hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] shadow-sm dark:shadow-none transition-all duration-500"
              style={{ opacity: 0 }}
              onClick={() => setSelectedImage(cert.image)}
            >
              <img 
                src={cert.image} 
                alt={`Certificate ${cert.id}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#050508]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <span className="text-slate-900 dark:text-white text-sm font-semibold tracking-wider bg-white/70 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-slate-200 dark:border-white/10">Click to expand</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/95 dark:bg-[#050508]/95 backdrop-blur-xl p-4 md:p-12 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-600 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors p-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full z-50 shadow-sm dark:shadow-none"
            onClick={() => setSelectedImage(null)}
            title="Close image"
          >
            <FiX size={26} />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Fullscreen Certificate" 
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl dark:shadow-[0_0_50px_rgba(139,92,246,0.2)] border border-slate-200 dark:border-white/10 transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  )
}
