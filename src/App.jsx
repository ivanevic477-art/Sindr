import { useLayoutEffect, useState } from 'react'
import './App.css'

const features = [
  {
    title: 'Live in days, not months',
    text: 'Tell us about your business and get a finished, professional website without hiring an agency.',
  },
  {
    title: 'Looks great everywhere',
    text: 'Every site is fast and designed to work on phones, tablets and desktops.',
  },
  {
    title: 'Found on Google',
    text: 'Search-friendly structure and clean markup so customers can actually find you.',
  },
  {
    title: 'Your own domain',
    text: 'Connect your own web address and keep a professional email-ready presence.',
  },
  {
    title: 'Easy to update',
    text: 'Change opening hours, prices or photos yourself in a couple of clicks.',
  },
  {
    title: 'Real people to help',
    text: 'Stuck on something? We are a message away and happy to take care of it for you.',
  },
]

const gmailLink =
  'https://mail.google.com/mail/?view=cm&fs=1&to=ivanevic477@gmail.com'

const clients = [
  {
    name: 'Eva-Prom Računovodstvo',
    quote: 'Sindr got our accounting firm online quickly and professionally. Clients find us much easier now.',
  },
]

const steps = [
  { n: '1', title: 'Describe your business', text: 'Answer a few simple questions: what you do, who you serve and how people reach you.' },
  { n: '2', title: 'Pick a look', text: 'Choose a style that fits your brand. Add your logo, colors and photos.' },
  { n: '3', title: 'Go live', text: 'Send the information through our e-mail and we will do the rest' },
]

const services = [
  {
    title: 'Website Development',
    description: 'Custom-built, fast websites tailored to your business — no templates, no compromises.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Website Design',
    description: 'Beautiful, modern designs that reflect your brand and make a strong first impression.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Website Management',
    description: 'We keep your site updated, secure, and running smoothly — so you can focus on your business.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

const formEndpoint = 'https://formsubmit.co/ajax/ivanevic477@gmail.com'

const year = new Date().getFullYear()

function App() {
  const [status, setStatus] = useState('idle')
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = document.querySelectorAll(
      'main h2, main .section-lead, main .card, .steps li, .clients-list li, .cta, .hero-actions',
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    targets.forEach((el) => {
      const i = Array.from(el.parentElement.children).indexOf(el)
      el.style.setProperty('--d', `${(i % 4) * 100}ms`)
      el.classList.add('reveal')
      observer.observe(el)
    })

    const hero = document.querySelector('.hero')
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const p = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight))
        hero.style.setProperty('--hp', p.toFixed(3))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      targets.forEach((el) => el.classList.remove('reveal', 'in'))
    }
  }, [])

  // Close mobile menu on nav link click
  const handleNavClick = () => setMenuOpen(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const d = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Quote request from ${d.firstName} ${d.lastName}`,
          _template: 'table',
          _honey: d._honey,
          name: `${d.firstName} ${d.lastName}`,
          email: d.email,
          country: d.country,
          message: d.message,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a href="#top" className="logo"><img src="/sindr-logo.png" alt="Sindr" /></a>
          <nav className="nav-links" aria-label="Main">
            <a href="#clients">Clients</a>
            <a href="#services">Services</a>
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="nav-right">
            <a href="#contact" className="btn btn-small">Get started</a>
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
          <nav className="mobile-nav" aria-label="Mobile">
            <a href="#clients" onClick={handleNavClick}>Clients</a>
            <a href="#services" onClick={handleNavClick}>Services</a>
            <a href="#features" onClick={handleNavClick}>Features</a>
            <a href="#how" onClick={handleNavClick}>How it works</a>
            <a href="#contact" onClick={handleNavClick}>Contact</a>
            <a href="#contact" className="btn mobile-cta" onClick={handleNavClick}>Get started</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <p className="eyebrow">Websites for business</p>
          <h1>Your business, online. <em>Without the hassle.</em></h1>
          <p className="lead">
            Sindr builds beautiful, fast websites for small and growing businesses, so you can
            focus on running yours.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn">Build my website</a>
            <a href="#how" className="btn btn-ghost">See how it works</a>
          </div>
          <p className="hero-note">No credit card needed to get started.</p>
        </section>

        <section id="clients" className="section container">
          <h2>Clients</h2>
          <p className="section-lead">Businesses we have built websites for.</p>
          <ul className="clients-list">
            {clients.map((c) => (
              <li key={c.name} className="client-card">
                <blockquote className="client-quote">"{c.quote}"</blockquote>
                <p className="client-name">{c.name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="services" className="section container">
          <h2>Services</h2>
          <p className="section-lead">Everything you need to get and keep your business online.</p>
          <ul className="grid">
            {services.map((s) => (
              <li key={s.title} className="card service">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="features" className="section container">
          <h2>Everything a business website needs</h2>
          <p className="section-lead">One simple service, from first draft to live site.</p>
          <ul className="grid">
            {features.map((f) => (
              <li key={f.title} className="card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="how" className="section alt">
          <div className="container">
            <h2>How it works</h2>
            <p className="section-lead">Three steps from idea to live website.</p>
            <ol className="steps">
              {steps.map((s) => (
                <li key={s.n}>
                  <span className="step-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="start" className="cta container">
          <h2>Ready to get your business online?</h2>
          <p>Start today and have your website live this week.</p>
          <a href="#contact" className="btn">Get started</a>
        </section>

        <section id="contact" className="section container contact-section">
          <h2>Contact us</h2>
          <p className="section-lead">Tell us about your project or ask us anything — we will get back to you.</p>

          <ul className="contact-cards">
            <li className="card">
              <h3>E-mail</h3>
              <a href={gmailLink} target="_blank" rel="noopener noreferrer">ivanevic477@gmail.com</a>
            </li>
          </ul>

          <form className="contact-form card" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                First name
                <input name="firstName" type="text" autoComplete="given-name" required />
              </label>
              <label>
                Last name
                <input name="lastName" type="text" autoComplete="family-name" required />
              </label>
            </div>
            <label>
              E-mail
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Country
              <input name="country" type="text" autoComplete="country-name" required />
            </label>
            <label>
              Message
              <textarea name="message" rows="5" placeholder="Write your request or question" required />
            </label>
            <input type="text" name="_honey" tabIndex="-1" autoComplete="off" className="honey" aria-hidden="true" />
            <button type="submit" className="btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Request a quote'}
            </button>
            {status === 'sent' && (
              <p className="form-msg" role="status">Thank you! Your request was sent. We will get back to you soon.</p>
            )}
            {status === 'error' && (
              <p className="form-msg error" role="alert">
                Something went wrong. Please e-mail us directly at ivanevic477@gmail.com.
              </p>
            )}
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a href="#top" className="logo"><img src="/sindr-logo.png" alt="Sindr" /></a>
          <p>© {year} Sindr. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default App
