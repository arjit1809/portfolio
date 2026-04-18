import { lazy, Suspense, useState, useRef, useEffect } from 'react'
import CinematicLoader from './components/CinematicLoader'
// import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import HeroCanvas from './components/hero/HeroCanvas'
import HeroText from './components/hero/HeroText'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import BackToTop from './components/BackToTop'
import DemonSlayerBackground from './components/DemonSlayerBackground'
import './styles/cursor.css'

// Lazy-load below-fold sections for better initial paint
const AboutSection = lazy(() => import('./components/sections/AboutSection'))
const EducationSection = lazy(() => import('./components/sections/EducationSection'))
const ResumeSection = lazy(() => import('./components/sections/ResumeSection'))
const SkillsSection = lazy(() => import('./components/sections/SkillsSection'))
const WorkSection = lazy(() => import('./components/sections/WorkSection'))
const CertificatesSection = lazy(() => import('./components/sections/CertificatesSection'))
const ContactSection = lazy(() => import('./components/sections/ContactSection'))

/* ─── Divider ──────────────────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent" />
    </div>
  )
}

/* ─── Section Loading Skeleton ─────────────────────────────────────────── */
function SectionSkeleton() {
  return <div className="py-32 flex items-center justify-center text-slate-700 text-sm">Loading...</div>
}

/* ─── Laser Root Video ─────────────────────────────────────────────────── */
function LaserRootVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play()
          } else {
            videoRef.current?.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => { observer.disconnect() }
  }, [])

  return (
    <div className="w-full flex justify-center overflow-hidden pointer-events-none relative z-0 -mt-24 md:-mt-48 pb-10">
      <video
        ref={videoRef}
        src="/huly_laser.mp4"
        loop
        muted
        playsInline
        className="w-full max-w-6xl h-auto object-cover invert mix-blend-multiply dark:invert-0 dark:mix-blend-screen opacity-90 transition-opacity duration-1000"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}

/* ─── Double Back To Exit Hook (Mobile) ────────────────────────────────── */
function useDoubleBackExit() {
  useEffect(() => {
    if (window.innerWidth <= 768) {
      // Ensure we don't push multiple times if hot-reloading
      if (!window.history.state?.isAppRoot) {
        window.history.pushState({ isAppRoot: true }, '')
      }

      let exitTimeout: ReturnType<typeof setTimeout>
      let canExit = false

      const handlePopState = (e: PopStateEvent) => {
        // If we popped the root state and haven't confirmed exit yet
        if (!e.state?.isAppRoot) {
          if (!canExit) {
            canExit = true
            // Intercept exit by pushing the state back immediately
            window.history.pushState({ isAppRoot: true }, '')

            // Show Toast
            const toast = document.createElement('div')
            toast.textContent = "Tap back again to exit"
            toast.className = "fixed bottom-[12%] left-1/2 -translate-x-1/2 bg-[#050508]/95 dark:bg-white/95 text-white dark:text-[#050508] border border-white/10 dark:border-slate-900/10 px-6 py-3 rounded-full text-sm font-semibold z-[9999] shadow-2xl backdrop-blur-md pointer-events-none transition-all duration-300"
            document.body.appendChild(toast)

            exitTimeout = setTimeout(() => {
              canExit = false
              toast.style.opacity = '0'
              setTimeout(() => toast.remove(), 300)
            }, 2000)
          }
        }
      }

      window.addEventListener('popstate', handlePopState)
      return () => {
        window.removeEventListener('popstate', handlePopState)
        clearTimeout(exitTimeout)
      }
    }
  }, [])
}

/* ─── App ──────────────────────────────────────────────────────────────── */
export default function App() {
  const [loading, setLoading] = useState(true)

  useDoubleBackExit()

  return (
    <>
      {/* ── Cinematic Loader ────────────────────────────────────────────── */}
      {loading && <CinematicLoader onFinish={() => setLoading(false)} />}

      <div style={{ 
        opacity: loading ? 0 : 1, 
        transition: 'opacity 0.8s ease',
        visibility: loading ? 'hidden' : 'visible'
      }}>

      {/* ── Demon Slayer Infinity Breathing Background ────────────────── */}
      {/* Fixed z-0 canvas, pointer-events none — sits behind everything  */}
      {!loading && <DemonSlayerBackground />}

      {/* ── Custom Cursor System ──────────────────────────────────────── */}
      <CustomCursor />

      {/* ── Back to Top Button ───────────────────────────────────────── */}
      <BackToTop />

      {/* <Analytics /> */}
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section id="home" className="relative w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#050508] transition-colors duration-500">
        {/* Full-viewport WebGL canvas */}
        <HeroCanvas />

        {/* Dynamic vignette to improve text legibility */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-50 dark:from-[#050508] via-slate-50/60 dark:via-[#050508]/60 to-transparent transition-colors duration-500" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-50 dark:from-[#050508] via-transparent to-transparent transition-colors duration-500" />

        {/* Hero text overlay */}
        <div className="relative z-10 h-full">
          <HeroText />
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="relative z-10 bg-slate-50 dark:bg-[#050508] transition-colors duration-500">
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>

        <Divider />

        <Suspense fallback={<SectionSkeleton />}>
          <EducationSection />
        </Suspense>

        <Divider />

        <Suspense fallback={<SectionSkeleton />}>
          <ResumeSection />
        </Suspense>

        <Divider />

        <Suspense fallback={<SectionSkeleton />}>
          <SkillsSection />
        </Suspense>

        <Divider />

        <Suspense fallback={<SectionSkeleton />}>
          <WorkSection />
        </Suspense>

        <Divider />

        <Suspense fallback={<SectionSkeleton />}>
          <CertificatesSection />
        </Suspense>

        <Divider />

        <Suspense fallback={<SectionSkeleton />}>
          <div className="relative z-20">
            <ContactSection />
          </div>
        </Suspense>

        <LaserRootVideo />
      </main>

      <Footer />
    </div>
    </>
  )
}
