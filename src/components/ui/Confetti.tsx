import { useEffect, useRef } from 'react'

export default function Confetti() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const colors = ['#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#3B82F6']
    const pieces: HTMLDivElement[] = []

    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      el.style.cssText = `
        position:fixed;
        top:${Math.random() * 20}vh;
        left:${Math.random() * 100}vw;
        width:${6 + Math.random() * 8}px;
        height:${6 + Math.random() * 8}px;
        background:${color};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        pointer-events:none;
        z-index:9999;
        animation:confettiFall ${1 + Math.random() * 1.5}s ease-in forwards;
        animation-delay:${Math.random() * 0.5}s;
      `
      container.appendChild(el)
      pieces.push(el)
    }

    const style = document.createElement('style')
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0); opacity: 1; }
        100% { transform: translateY(80vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    return () => {
      pieces.forEach((p) => p.remove())
      style.remove()
    }
  }, [])

  return <div ref={ref} aria-hidden />
}
