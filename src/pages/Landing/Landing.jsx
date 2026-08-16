import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import HeroIllustration from '../../components/landing/HeroIllustration.jsx'
import ProcessSteps from '../../components/landing/ProcessSteps.jsx'

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-14 md:grid-cols-2 md:px-10 md:pt-20">
        <div>
          <p className="mb-4 font-[var(--font-hand)] text-2xl text-pink-deep">
            for the people you love
          </p>
          <h1 className="font-[var(--font-display)] text-4xl leading-[1.1] text-ink md:text-5xl">
            Some things deserve more than a text.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
            Bunny Sends You Letters lets you write, decorate, and send beautiful digital
            letters to the people you care about — stickers, photos, and all
            the little touches a text message can't hold.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/editor"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream shadow-[0_6px_18px_rgba(73,60,52,0.28)] transition-transform hover:-translate-y-0.5"
            >
              Write a Letter
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            >
              See How It Works
            </a>
          </div>
        </div>

        <HeroIllustration />
      </section>

      {/* Process */}
      <div id="how-it-works">
        <ProcessSteps />
      </div>

      <footer className="border-t border-ink/10 px-6 py-10 text-center text-sm text-ink-soft">
        Made for the letters you haven't sent yet. 🌷
      </footer>
    </div>
  )
}
