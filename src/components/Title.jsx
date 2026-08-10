import React from 'react'

// Deliberately size-agnostic: every call site sets the font size on its parent.
const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-3 items-center mb-3'>
      <p className='text-stone'>{text1} <span className='font-display text-ink'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-px bg-line'></p>
    </div>
  )
}

export default Title
