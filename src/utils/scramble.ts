const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

export function scramble(el: HTMLElement | null) {
  if (!el) return
  
  const original = el.dataset.text || el.textContent
  if (!original) return
  
  el.dataset.text = original

  if ((el as HTMLElement & { _scrambleInterval?: number })._scrambleInterval) {
    clearInterval((el as HTMLElement & { _scrambleInterval?: number })._scrambleInterval!)
  }

  let iterations = 0
  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, i) => {
      if (char === ' ') return ' '
      return i < iterations ? char : CHARS[Math.floor(Math.random() * CHARS.length)]
    }).join('')
    
    if (iterations >= original.length) {
      clearInterval(interval)
      el.textContent = original // ensure EXACT original is restored (including spaces)
    }
    iterations += 1 / 3
  }, 30)

  ;(el as HTMLElement & { _scrambleInterval?: number })._scrambleInterval = interval
}
