import React from 'react'

// Deliberately size-agnostic: every call site sets the font size on its parent.
//
// Renders a real heading element. This used to emit a <p>, which left several
// pages (Collection, About, Contact, Terms) with no <h1> at all and turned every
// homepage section header into body text — so nothing on the page told a crawler
// what it was looking at. Callers pass `as` to place it in the outline; it
// cannot be wrapped in an <h1> from outside, since a <p> inside a heading is
// invalid HTML.
const Title = ({ text1, text2, as: Heading = 'h2' }) => {
  return (
    <div className='inline-flex gap-3 items-center mb-3'>
      {/* `${text1} ` is one interpolation on purpose. Written as `{text1} <span>`
          it is two adjacent text children, and React expects two text nodes at
          hydration — but the prerendered HTML has already merged them into one
          when it was serialized and reparsed, which fails hydration on every
          page that renders a Title. */}
      <Heading className='text-stone font-normal'>{`${text1} `}<span className='font-display text-ink'>{text2}</span></Heading>
      <span className='w-8 sm:w-12 h-px bg-line'></span>
    </div>
  )
}

export default Title
