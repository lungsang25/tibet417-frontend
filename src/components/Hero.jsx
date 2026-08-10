import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import hero_img from '../assets/hero/hero_img.png'
import hero_img1 from '../assets/hero/p_img38(1).jpg'
import hero_img2 from '../assets/hero/p_img4.png'

// Single source of truth for the hero. Add, reorder or swap slides here —
// nothing below needs to change.
const slides = [
  {
    image: hero_img,
    eyebrow: 'New Arrivals',
    title: 'Woven in the Himalayas',
    cta: 'Shop the collection',
    href: '/collection',
    alt: 'Model wearing a hand-woven Tibetan wool piece from the new arrivals collection',
    position: 'center',
  },
  {
    image: hero_img1,
    eyebrow: 'The Winter Edit',
    title: 'Made for the cold',
    cta: 'Explore winterwear',
    href: '/collection',
    alt: 'Layered winterwear styled against a mountain backdrop',
    position: 'center',
  },
  {
    image: hero_img2,
    eyebrow: 'Best Sellers',
    title: 'Pieces that endure',
    cta: 'Shop best sellers',
    href: '/collection',
    alt: 'Close-up of textured fabric from the Tibet417 best sellers range',
    position: 'center',
  },
]

const AUTOPLAY_MS = 5000
const SWIPE_THRESHOLD = 50

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Chevron = ({ direction }) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1'
    strokeLinecap='square'
    className='w-6 h-6'
    aria-hidden='true'
  >
    <path d={direction === 'prev' ? 'M15 4 L7 12 L15 20' : 'M9 4 L17 12 L9 20'} />
  </svg>
)

const Hero = () => {
  // [lastClone, ...slides, firstClone] gives a seamless infinite slide.
  const track = [slides[slides.length - 1], ...slides, slides[0]]
  const lastIndex = track.length - 1

  const [pos, setPos] = useState(1)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion()
  }, [])

  const activeIndex = (pos - 1 + slides.length) % slides.length

  const next = useCallback(() => {
    setAnimate(true)
    setPos((p) => p + 1)
  }, [])

  const prev = useCallback(() => {
    setAnimate(true)
    setPos((p) => p - 1)
  }, [])

  const goTo = useCallback((index) => {
    setAnimate(true)
    setPos(index + 1)
  }, [])

  // Auto-advance, suspended while hovered/focused or under reduced motion.
  useEffect(() => {
    if (paused || reducedMotion.current) return
    const timer = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, next])

  // After the un-animated jump between clone and real slide has been committed,
  // re-enable the transition. Double rAF guarantees the jump has painted first.
  useEffect(() => {
    if (animate) return
    let raf2
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimate(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [animate])

  const handleTransitionEnd = () => {
    if (pos === lastIndex) {
      setAnimate(false)
      setPos(1)
    } else if (pos === 0) {
      setAnimate(false)
      setPos(slides.length)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
    }
  }

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    if (delta <= -SWIPE_THRESHOLD) next()
    else if (delta >= SWIPE_THRESHOLD) prev()
    touchStartX.current = null
  }

  const activeSlide = slides[activeIndex]

  return (
    <section
      role='region'
      aria-roledescription='carousel'
      aria-label='Featured collections'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className='full-bleed relative overflow-hidden bg-ink h-[78vh] sm:h-[70vh] min-h-[440px] max-h-[760px] outline-none'
    >
      {/* Slide track */}
      <div
        className={`flex h-full ${
          animate
            ? 'transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]'
            : 'transition-none'
        }`}
        style={{ transform: `translateX(-${pos * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {track.map((slide, index) => (
          <div
            key={index}
            className='relative w-full min-w-full h-full overflow-hidden'
            aria-hidden={index !== pos}
          >
            <img
              src={slide.image}
              alt={index === pos ? slide.alt : ''}
              loading={index <= 1 ? 'eager' : 'lazy'}
              fetchpriority={index === 1 ? 'high' : 'auto'}
              style={{ objectPosition: slide.position }}
              // Inactive slides hold the animation's end state so a slide
              // leaving view doesn't visibly snap back to scale 1.
              className={`w-full h-full object-cover ${
                index === pos ? 'animate-ken-burns' : 'scale-[1.06]'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Legibility scrim — light hero images need both a horizontal and a
          bottom-up pass to keep the overlaid copy readable. */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none' />
      <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none' />
      <div className='absolute inset-0 bg-black/20 sm:hidden pointer-events-none' />

      {/* Overlaid copy — re-aligned with the site gutter */}
      <div className='absolute inset-0 flex items-end pb-16 sm:pb-20'>
        <div className='w-full px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <div key={activeIndex} className='animate-fade-up max-w-xl'>
            <p className='text-[11px] uppercase tracking-label text-white/80'>
              {activeSlide.eyebrow}
            </p>
            {/* h2, not h1. This text changes every few seconds, so as an h1 it
                made the homepage's main heading whatever slide happened to be
                showing when the prerenderer took its snapshot — "Woven in the
                Himalayas" on one build, "Made for the cold" on the next. The
                stable h1 lives in Home.jsx. */}
            <h2 className='mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-white'>
              {activeSlide.title}
            </h2>
            <Link
              to={activeSlide.href}
              onClick={() => scrollTo(0, 0)}
              className='inline-block mt-8 bg-white text-ink px-8 py-3.5 text-[11px] uppercase tracking-label hover:bg-ink hover:text-white transition-colors duration-300'
            >
              {activeSlide.cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        type='button'
        onClick={prev}
        aria-label='Previous slide'
        className='hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 text-white/70 hover:text-white transition-colors duration-300'
      >
        <Chevron direction='prev' />
      </button>
      <button
        type='button'
        onClick={next}
        aria-label='Next slide'
        className='hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 text-white/70 hover:text-white transition-colors duration-300'
      >
        <Chevron direction='next' />
      </button>

      {/* Indicators */}
      <div className='absolute bottom-8 left-0 right-0 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <div className='flex gap-2'>
          {slides.map((slide, index) => (
            <button
              key={index}
              type='button'
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-current={activeIndex === index}
              className='py-2 group'
            >
              <span
                className={`block h-px w-8 transition-colors duration-300 ${
                  activeIndex === index
                    ? 'bg-white'
                    : 'bg-white/40 group-hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
