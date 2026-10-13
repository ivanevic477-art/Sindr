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

const steps = [
  { n: '1', title: 'Describe your business', text: 'Answer a few simple questions: what you do, who you serve and how people reach you.' },
  { n: '2', title: 'Pick a look', text: 'Choose a style that fits your brand. Add your logo, colors and photos.' },
  { n: '3', title: 'Go live', text: 'Review, publish and start getting customers online.' },
]

const plans = [
  { name: 'Starter', price: '€30', note: 'per month', items: ['1 website', 'Sindr subdomain', 'Contact form'], featured: false },
  { name: 'Business', price: '$39', note: 'per month', items: ['Custom domain', 'Up to 10 pages', 'SEO tools', 'Priority support'], featured: true },
  { name: 'Growth', price: '$79', note: 'per month', items: ['Everything in Business', 'Online booking', 'Analytics', 'Unlimited pages'], featured: false },
]

const year = new Date().getFullYear()

function App() {
  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a href="#top" className="logo">sindr<span>.</span></a>
          <nav className="nav-links" aria-label="Main">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <a href="#start" className="btn btn-small">Get started</a>
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
            <a href="#start" className="btn">Build my website</a>
            <a href="#how" className="btn btn-ghost">See how it works</a>
          </div>
          <p className="hero-note">No credit card needed to get started.</p>
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

        <section id="pricing" className="section container">
          <h2>Simple pricing</h2>
          <p className="section-lead">Pick a plan. Change or cancel any time.</p>
          <ul className="grid plans">
            {plans.map((p) => (
              <li key={p.name} className={p.featured ? 'card plan featured' : 'card plan'}>
                {p.featured && <span className="badge">Most popular</span>}
                <h3>{p.name}</h3>
                <p className="price">{p.price} <span>{p.note}</span></p>
                <ul className="plan-items">
                  {p.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
                <a href="#start" className={p.featured ? 'btn' : 'btn btn-ghost'}>Choose {p.name}</a>
              </li>
            ))}
          </ul>
        </section>

        <section id="start" className="cta container">
          <h2>Ready to get your business online?</h2>
          <p>Start today and have your website live this week.</p>
          <a href="mailto:hello@sindr.example" className="btn">Get started</a>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a href="#top" className="logo">sindr<span>.</span></a>
          <p>© {year} Sindr. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default App
