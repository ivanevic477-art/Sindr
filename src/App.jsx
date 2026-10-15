import { useEffect, useLayoutEffect, useState } from 'react'
import { translations } from './i18n.js'
import './App.css'

const gmailLink =
  'https://mail.google.com/mail/?view=cm&fs=1&to=ivanevic477@gmail.com'

const serviceIcons = [
  <svg key="dev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,
  <svg key="design" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>,
  <svg key="manage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
]

const formEndpoint = 'https://formsubmit.co/ajax/ivanevic477@gmail.com'

const year = new Date().getFullYear()

function getInitialLang() {
  try {
    const saved = localStorage.getItem('sindr-lang')
    if (saved && translations[saved]) return saved
  } catch {
    // storage unavailable; fall through to browser language
  }
  return navigator.language?.toLowerCase().startsWith('hr') ? 'hr' : 'en'
}

function App() {
  const [status, setStatus] = useState('idle')
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState(getInitialLang)
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.lang = t.htmlLang
    document.title = t.pageTitle
    try {
      localStorage.setItem('sindr-lang', lang)
    } catch {
      // ignore: preference just won't persist
    }
  }, [lang, t])

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
          language: lang,
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
          <nav className="nav-links" aria-label={t.nav.mainLabel}>
            <a href="#clients">{t.nav.clients}</a>
            <a href="#services">{t.nav.services}</a>
            <a href="#features">{t.nav.features}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <div className="nav-right">
            <div className="lang-switch" role="group" aria-label={t.nav.language}>
              {Object.keys(translations).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={code === lang ? 'active' : ''}
                  aria-pressed={code === lang}
                  onClick={() => setLang(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="#contact" className="btn btn-small">{t.nav.getStarted}</a>
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              aria-label={t.nav.toggleMenu}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
          <nav className="mobile-nav" aria-label={t.nav.mobileLabel}>
            <a href="#clients" onClick={handleNavClick}>{t.nav.clients}</a>
            <a href="#services" onClick={handleNavClick}>{t.nav.services}</a>
            <a href="#features" onClick={handleNavClick}>{t.nav.features}</a>
            <a href="#how" onClick={handleNavClick}>{t.nav.how}</a>
            <a href="#contact" onClick={handleNavClick}>{t.nav.contact}</a>
            <a href="#contact" className="btn mobile-cta" onClick={handleNavClick}>{t.nav.getStarted}</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.titleA} <em>{t.hero.titleB}</em></h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="hero-actions">
            <a href="#contact" className="btn">{t.hero.primary}</a>
            <a href="#how" className="btn btn-ghost">{t.hero.secondary}</a>
          </div>
          <p className="hero-note">{t.hero.note}</p>
        </section>

        <section id="clients" className="section container">
          <h2>{t.clients.title}</h2>
          <p className="section-lead">{t.clients.lead}</p>
          <ul className="clients-list">
            {t.clients.items.map((c) => (
              <li key={c.name} className="client-card">
                <blockquote className="client-quote">"{c.quote}"</blockquote>
                <p className="client-name">{c.name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="services" className="section container">
          <h2>{t.services.title}</h2>
          <p className="section-lead">{t.services.lead}</p>
          <ul className="grid">
            {t.services.items.map((s, i) => (
              <li key={i} className="card service">
                <div className="service-icon">{serviceIcons[i]}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="features" className="section container">
          <h2>{t.features.title}</h2>
          <p className="section-lead">{t.features.lead}</p>
          <ul className="grid">
            {t.features.items.map((f, i) => (
              <li key={i} className="card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="how" className="section alt">
          <div className="container">
            <h2>{t.how.title}</h2>
            <p className="section-lead">{t.how.lead}</p>
            <ol className="steps">
              {t.how.steps.map((s, i) => (
                <li key={i}>
                  <span className="step-n">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="start" className="cta container">
          <h2>{t.cta.title}</h2>
          <p>{t.cta.text}</p>
          <a href="#contact" className="btn">{t.cta.button}</a>
        </section>

        <section id="contact" className="section container contact-section">
          <h2>{t.contact.title}</h2>
          <p className="section-lead">{t.contact.lead}</p>

          <ul className="contact-cards">
            <li className="card">
              <h3>{t.contact.email}</h3>
              <a href={gmailLink} target="_blank" rel="noopener noreferrer">ivanevic477@gmail.com</a>
            </li>
          </ul>

          <form className="contact-form card" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                {t.contact.firstName}
                <input name="firstName" type="text" autoComplete="given-name" required />
              </label>
              <label>
                {t.contact.lastName}
                <input name="lastName" type="text" autoComplete="family-name" required />
              </label>
            </div>
            <label>
              {t.contact.email}
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              {t.contact.country}
              <input name="country" type="text" autoComplete="country-name" required />
            </label>
            <label>
              {t.contact.message}
              <textarea name="message" rows="5" placeholder={t.contact.placeholder} required />
            </label>
            <input type="text" name="_honey" tabIndex="-1" autoComplete="off" className="honey" aria-hidden="true" />
            <button type="submit" className="btn" disabled={status === 'sending'}>
              {status === 'sending' ? t.contact.sending : t.contact.submit}
            </button>
            {status === 'sent' && (
              <p className="form-msg" role="status">{t.contact.sent}</p>
            )}
            {status === 'error' && (
              <p className="form-msg error" role="alert">{t.contact.error}</p>
            )}
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a href="#top" className="logo"><img src="/sindr-logo.png" alt="Sindr" /></a>
          <p>© {year} Sindr. {t.footer}</p>
        </div>
      </footer>
    </>
  )
}

export default App
