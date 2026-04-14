import { lazy, Suspense, useState, useRef, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import HeroCanvas from './components/hero/HeroCanvas'
import HeroText from './components/hero/HeroText'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import BackToTop from './components/BackToTop'
import './styles/cursor.css'

// Lazy-load below-fold sections for better initial paint
const AboutSection = lazy(() => import('./components/sections/AboutSection'))
const EducationSection = lazy(() => import('./components/sections/EducationSection'))
const ResumeSection = lazy(() => import('./components/sections/ResumeSection'))
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

/* ─── App ──────────────────────────────────────────────────────────────── */
export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {/* ── Loading Screen ────────────────────────────────────────────── */}
      {loading && <LoadingScreen onFinished={() => setLoading(false)} />}
      {/* ── Custom Cursor System ──────────────────────────────────────── */}
      <CustomCursor />

      {/* ── Back to Top Button ───────────────────────────────────────── */}
      <BackToTop />

      <Analytics />
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
    </>
  )
}
