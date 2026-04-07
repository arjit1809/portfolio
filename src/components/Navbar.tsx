import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Resume', href: '#resume' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains('dark'))

    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    )

    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDark(true)
    }
  }

  return (
    <>
      <nav
        ref={navRef}
        style={{ opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-white/80 dark:bg-[#050508]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-slate-900 dark:text-white font-black text-xl tracking-tight select-none">
            ar<span className="text-violet-500 dark:text-violet-400">jit</span>
            <span className="text-violet-500">.</span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-white text-sm font-medium transition-colors duration-200 relative group"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-500 dark:bg-violet-400 group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-white transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Desktop CTA */}
            <a
              href="#contact"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30"
            >
              Let's Talk
            </a>
          </div>

          <div className="md:hidden flex items-center gap-3">
             {/* Mobile Theme Toggle */}
             <button 
              onClick={toggleTheme}
              className="p-2 text-slate-900 dark:text-white"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            {/* Mobile menu button */}
            <button
              className="text-slate-900 dark:text-white p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-slate-50/95 dark:bg-[#050508]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-400 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={() => setOpen(false)}
            className="text-slate-900 dark:text-white text-3xl font-bold hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="mt-4 bg-violet-600 text-white font-semibold px-8 py-3 rounded-full"
        >
          Let's Talk
        </a>
      </div>
    </>
  )
}
