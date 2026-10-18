import { useEffect, useRef, useState } from 'react'
import './Intro.css'

// Deterministic pseudo-random so the embers look scattered but render the same every time.
const rand = (n) => {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const flames = Array.from({ length: 9 }, (_, i) => ({
  x: 8 + i * 10.5,
  w: 190 + rand(i + 1) * 140,
  h: 560 + rand(i + 7) * 300,
  t: 0.45 + rand(i + 3) * 0.5,
  d: -rand(i + 9),
}))

const embers = Array.from({ length: 34 }, (_, i) => ({
  x: 18 + rand(i + 21) * 64,
  s: 3 + rand(i + 33) * 5,
  t: 1.6 + rand(i + 45) * 2.2,
  d: 1.1 + rand(i + 57) * 1.6,
  dx: (rand(i + 69) - 0.5) * 180,
}))

const QUOTE_START_MS = 2300 // after the hammer lands and the name is revealed
const QUOTE_MS = 20000

// Full-screen opening scene at the top of the page. It plays on load, stays while the
// visitor is at the top, and replays whenever they scroll back up to it.
function QuoteLoop({ quotes }) {
  const [i, setI] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let interval
    const start = setTimeout(() => {
      setStarted(true)
      if (!reduce) interval = setInterval(() => setI((n) => (n + 1) % quotes.length), QUOTE_MS)
    }, QUOTE_START_MS)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [quotes.length])

  return (
    <div className="intro-quotes">
      {started && (
        <p key={i} className="intro-quote" style={{ '--q': `${QUOTE_MS}ms` }}>
          {quotes[i]}
        </p>
      )}
    </div>
  )
}

export default function Intro({ quotes }) {
  const ref = useRef(null)
  const [run, setRun] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    let wasHidden = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          wasHidden = true
        } else if (wasHidden) {
          wasHidden = false
          setRun((n) => n + 1) // remount the scene so the animation restarts
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="top" className="intro" ref={ref} aria-label="Sindr">
      <div className="intro-scene" key={run} aria-hidden="true">
        <div className="intro-fire">
          {flames.map((f, i) => (
            <span
              key={i}
              className="flame"
              style={{
                '--x': `${f.x}%`,
                '--w': `${f.w}px`,
                '--h': `${f.h}px`,
                '--t': `${f.t}s`,
                '--fd': `${f.d}s`,
              }}
            />
          ))}
        </div>

        {embers.map((e, i) => (
          <span
            key={i}
            className="ember"
            style={{
              '--x': `${e.x}%`,
              '--s': `${e.s}px`,
              '--t': `${e.t}s`,
              '--ed': `${e.d}s`,
              '--dx': `${e.dx}px`,
            }}
          />
        ))}

        <div className="intro-glow" />
        <div className="intro-flash" />

        <div className="intro-stage">
          <div className="intro-lockup">
            <div className="intro-mark-wrap">
              <img className="intro-mark" src="/sindr-mark.png" alt="" />
              <span className="intro-ring" />
            </div>
            <img className="intro-word" src="/sindr-wordmark.png" alt="" />
          </div>
          <QuoteLoop quotes={quotes} />
        </div>
      </div>

      <ul className="sr-only">
        {quotes.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <a href="#main" className="intro-scroll" aria-label="Scroll down">
        <span>Scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  )
}
