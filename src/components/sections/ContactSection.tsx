import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiSend, FiMail, FiMapPin, FiGithub, FiLinkedin, FiX, FiCheckCircle } from 'react-icons/fi'
import { createClient } from '@supabase/supabase-js'

gsap.registerPlugin(ScrollTrigger)

const SUPABASE_URL = 'https://ccrnotmxjxyqepdpjkcq.supabase.co'
const SUPABASE_KEY = 'sb_publishable_LjAL9M1zqkPTs0eDUK-Qew_gqwglzOn'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [showPopup, setShowPopup] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-reveal',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg(null)

    const { error } = await supabase
      .from('contacts')
      .insert([{ name: form.name, email: form.email, message: form.message }])

    if (error) {
      console.error('Supabase error:', error)
      setErrorMsg(`Failed to send: ${error.message}. Please email me directly at arjit9b@gmail.com`)
      setStatus('error')
      return
    }

    setStatus('sent')
    setShowPopup(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-6 md:px-14 lg:px-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="contact-reveal flex items-center gap-3 mb-4" style={{ opacity: 0 }}>
        <div className="h-px w-8 bg-violet-500" />
        <span className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-widest uppercase">Contact</span>
      </div>
      <h2 className="contact-reveal text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight" style={{ opacity: 0 }}>
        Let's build something{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          extraordinary
        </span>
      </h2>
      <p className="contact-reveal text-slate-600 dark:text-slate-400 mb-16 max-w-xl" style={{ opacity: 0 }}>
        Have a project in mind or just want to chat about technology? I'm always open to new
        opportunities and interesting conversations.
      </p>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Info */}
        <div className="space-y-8">
          {[
            { icon: FiMail, label: 'Email', value: 'arjit9b@gmail.com' },
            { icon: FiMapPin, label: 'Location', value: 'Remote — Worldwide' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="contact-reveal flex items-center gap-4" style={{ opacity: 0 }}>
              <div className="w-12 h-12 rounded-xl border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm dark:shadow-none">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-slate-900 dark:text-white font-medium">{value}</p>
              </div>
            </div>
          ))}

          <div className="contact-reveal" style={{ opacity: 0 }}>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">Find me online</p>
            <div className="flex gap-3">
              <a
                href="https://github.com/arjit1809"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:border-violet-400 dark:hover:text-white dark:hover:border-violet-400/50 hover:bg-slate-50 dark:hover:bg-violet-500/15 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <FiGithub size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/arjit-kumar-sahu-96a837362/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:border-violet-400 dark:hover:text-white dark:hover:border-violet-400/50 hover:bg-slate-50 dark:hover:bg-violet-500/15 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <FiLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Availability banner */}
          <div className="contact-reveal rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 p-5 flex items-center gap-4" style={{ opacity: 0 }}>
            <div className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">Available for work</p>
              <p className="text-slate-600 dark:text-slate-500 text-xs">Currently taking on new projects — let's talk!</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { id: 'name', label: 'Name', type: 'text', placeholder: 'John Doe' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id} className="contact-reveal" style={{ opacity: 0 }}>
              <label htmlFor={id} className="block text-slate-600 dark:text-slate-400 text-sm mb-2 font-medium">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={form[id as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                placeholder={placeholder}
                required
                className="w-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/60 focus:bg-slate-50 dark:focus:bg-violet-500/5 transition-all duration-200 shadow-sm dark:shadow-none"
              />
            </div>
          ))}

          <div className="contact-reveal" style={{ opacity: 0 }}>
            <label htmlFor="message" className="block text-slate-600 dark:text-slate-400 text-sm mb-2 font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Tell me about your project..."
              required
              className="w-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/60 focus:bg-slate-50 dark:focus:bg-violet-500/5 transition-all duration-200 resize-none shadow-sm dark:shadow-none"
            />
          </div>

          <div className="contact-reveal" style={{ opacity: 0 }}>
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-4 rounded-xl transition-all duration-300 shadow-sm dark:shadow-none ${
                status === 'sent'
                  ? 'bg-emerald-600 text-white cursor-not-allowed'
                  : status === 'error'
                  ? 'bg-red-600 hover:bg-red-500 text-white hover:shadow-xl hover:shadow-red-500/25'
                  : 'bg-violet-600 hover:bg-violet-500 text-white hover:shadow-xl hover:shadow-violet-500/25'
              }`}
            >
              {status === 'idle' && (<><FiSend /> Send Message</>)}
              {status === 'sending' && <span className="animate-pulse">Sending...</span>}
              {status === 'sent' && '✓ Message sent — I\'ll be in touch!'}
              {status === 'error' && (<><FiSend /> Try Again</>)}
            </button>
            {errorMsg && (
              <p className="mt-3 text-red-500 dark:text-red-400 text-xs text-center leading-relaxed">{errorMsg}</p>
            )}
          </div>
        </form>
      </div>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowPopup(false)}
          />
          <div className="relative bg-white dark:bg-[#0f0f13] border border-slate-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-none"
              data-cursor="button"
            >
              <FiX size={20} />
            </button>
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
              <FiCheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Response Submitted
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-2">
              Thank you for reaching out! I've received your message. For any immediate inquiries or further information, please feel free to contact me directly via email at <span className="font-semibold text-violet-600 dark:text-violet-400">arjit9b@gmail.com</span>.
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="mt-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 py-3 px-8 rounded-xl transition-all shadow-sm w-full cursor-none"
              data-cursor="button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
