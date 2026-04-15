import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiX, FiGithub, FiExternalLink } from 'react-icons/fi'
import { scramble } from '../../utils/scramble'

gsap.registerPlugin(ScrollTrigger)

/* ── Project Data ─────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    title: "Goody Gifteez",
    tagline: "Omni-search gifts across the entire web at once",
    description:
      "A universal gift-search aggregator that queries multiple platforms simultaneously, surfacing the best results in a clean, filterable interface with real-time suggestions and sort controls.",
    image: '/projects/goody-gifteez.png',
    tech: ['React', 'Node.js', 'REST APIs', 'TailwindCSS'],
    github: 'https://github.com/arjit1809/grabzee-omni-search',
    live: null,
    accent: 'from-sky-500 to-cyan-400',
    accentBg: 'rgba(14,165,233,0.08)',
    accentBorder: 'rgba(14,165,233,0.25)',
  },
  {
    id: 2,
    title: "Dá Crsp",
    tagline: "Crispy street food delivered to your door",
    description:
      "A full-featured food delivery web app with real-time order tracking, dynamic menu filtering, cart management, and a responsive checkout flow built with pure HTML, CSS & JavaScript backed by Supabase.",
    image: '/projects/da-crsp.png',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Supabase'],
    github: 'https://github.com/arjit1809/D-Crsp',
    live: null,
    accent: 'from-orange-500 to-amber-400',
    accentBg: 'rgba(249,115,22,0.08)',
    accentBorder: 'rgba(249,115,22,0.25)',
  },
  {
    id: 3,
    title: "AI Music Detector",
    tagline: "AI-powered music recognition & genre detection",
    description:
      "An intelligent music detection app that identifies songs from audio input using AI, classifies genres, displays song metadata, and builds a listening history — all in the browser.",
    image: '/projects/ai-music.png',
    tech: ['React', 'Python', 'AI / ML', 'Web Audio API'],
    github: 'https://github.com/arjit1809/sonic-spark-saga',
    live: null,
    accent: 'from-violet-500 to-purple-400',
    accentBg: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.25)',
  },
]

/* ── Tech Chip ────────────────────────────────────────────────── */
function TechChip({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
      {label}
    </span>
  )
}

/* ── Project Card ─────────────────────────────────────────────── */
function ProjectCard({
  project,
  onImageClick,
}: {
  project: (typeof PROJECTS)[0]
  onImageClick: (img: string) => void
}) {
  return (
    <div
      className="project-slot group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a10] hover:border-violet-300 dark:hover:border-violet-500/40 hover:shadow-xl dark:hover:shadow-[0_0_40px_rgba(139,92,246,0.12)] shadow-sm dark:shadow-none transition-all duration-500"
      style={{ opacity: 0 }}
      data-cursor="card"
    >
      {/* ── Screenshot (clickable, opens lightbox) ── */}
      <div
        className="relative overflow-hidden aspect-[4/3] sm:aspect-[16/9] cursor-pointer flex-shrink-0 bg-slate-100 dark:bg-black/60 p-2 sm:p-0 flex items-center justify-center"
        onClick={() => onImageClick(project.image)}
        title="Click to expand"
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-contain sm:object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
        />
        {/* Expand hint overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-semibold tracking-wider bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            Expand
          </span>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        {/* Title + tagline */}
        <div className="mb-3">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-snug mb-0.5">
            {project.title}
          </h3>
          <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold">
            {project.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.map((t) => (
            <TechChip key={t} label={t} />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 border border-slate-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/50 px-4 py-2 rounded-xl transition-all duration-200 bg-slate-50 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-500/10"
          >
            <FiGithub size={14} />
            GitHub
          </a>
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30"
            >
              <FiExternalLink size={14} />
              Live Demo
            </a>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-600 italic">
              Demo coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── WorkSection ──────────────────────────────────────────────── */
export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.work-header',
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
        '.project-slot',
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selectedImage ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedImage])

  return (
    <>
      <section id="work" ref={sectionRef} className="py-20 sm:py-32 px-4 sm:px-6 md:px-14 lg:px-20 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="work-header flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
          <div className="h-px w-8 bg-violet-500" />
          <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">My Work</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2
            className="work-header text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight"
            style={{ opacity: 0 }}
          >
            Recent{' '}
            <span
              onMouseEnter={(e) => scramble(e.currentTarget)}
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Projects
            </span>
          </h2>
          <p className="work-header text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed" style={{ opacity: 0 }}>
            A selection of things I've built — from food delivery apps to AI-powered tools.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="projects-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onImageClick={setSelectedImage}
            />
          ))}
        </div>
      </section>

      {/* ── Lightbox Modal ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/95 dark:bg-[#050508]/95 backdrop-blur-xl transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 md:top-10 md:right-10 text-slate-600 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 active:scale-90 transition-all p-3 bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 rounded-full z-[110] shadow-lg dark:shadow-none min-w-[48px] min-h-[48px] flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null) }}
            aria-label="Close image"
          >
            <FiX size={24} />
          </button>

          <img
            src={selectedImage}
            alt="Fullscreen Project"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl dark:shadow-[0_0_60px_rgba(139,92,246,0.2)] border border-slate-200 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          />

          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 dark:text-slate-500 md:hidden">
            Tap anywhere to close
          </p>
        </div>
      )}
    </>
  )
}
