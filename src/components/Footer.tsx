import { FiGithub, FiLinkedin, FiInstagram, FiHeart } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/6 py-10 px-6 md:px-14 lg:px-20 max-w-7xl mx-auto transition-colors duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500 text-sm">
          <span>© {new Date().getFullYear()}</span>
          <span className="font-bold text-slate-900 dark:text-white">
            ar<span className="text-violet-600 dark:text-violet-400">jit</span>
          </span>
          <span>— Made with</span>
          <FiHeart className="text-violet-600 dark:text-violet-500 fill-violet-600 dark:fill-violet-500" size={12} />
          <span>&amp; Three.js</span>
        </div>

        <div className="flex items-center gap-4">
          {[
            { icon: FiGithub, href: 'https://github.com/arjit1809', label: 'GitHub' },
            { icon: FiLinkedin, href: 'https://www.linkedin.com/in/arjit-kumar-sahu-96a837362/', label: 'LinkedIn' },
            { icon: FiInstagram, href: 'https://www.instagram.com/arjit_1809?igsh=YmRqbTU2eDEwczg4', label: 'Instagram' },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
