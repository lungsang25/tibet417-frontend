import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import hero_img from '../assets/hero/hero_img.png'
import hero_img1 from '../assets/hero/p_img38(1).jpg'
import hero_img2 from '../assets/hero/p_img38(2).jpg'
import hero_img3 from '../assets/hero/p_img38.jpg'
import hero_img4 from '../assets/hero/p_img4.png'

const Hero = () => {
  // Select a few product images for the hero slider
  const heroImages = [
    hero_img,
    hero_img1,
    hero_img2,
    hero_img3,
    hero_img4,
  ];

  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef(null);
  
  // Create an array with clones for infinite effect
  // Format: [last item, ...all items, first item]
  const extendedImages = [
    heroImages[heroImages.length - 1],
    ...heroImages,
    heroImages[0]
  ];

  // Handle the transition end
  const handleTransitionEnd = () => {
    // If we're at the clone of the first slide (at the end)
    if (currentSlide >= heroImages.length + 1) {
      setIsTransitioning(false);
      setCurrentSlide(1); // Jump to the real first slide
    }
    
    // If we're at the clone of the last slide (at the beginning)
    if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(heroImages.length); // Jump to the real last slide
    }
  };

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide(prevSlide => prevSlide + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Handle manual navigation
  const goToSlide = (slideIndex) => {
    setIsTransitioning(true);
    setCurrentSlide(slideIndex + 1); // +1 because of the cloned slide at the beginning
  };

  // Reset transition when needed
  useEffect(() => {
    if (!isTransitioning) {
      sliderRef.current.style.transition = 'none';
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
        }
      }, 50);
    } else {
      if (sliderRef.current) {
        sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
      }
    }
  }, [isTransitioning, currentSlide]);

  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141]'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    <p className=' font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                    <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                </div>
            </div>
      </div>
      
      {/* Hero Right Side - Image Slider */}
      <div className='w-full sm:w-1/2 relative overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]'>
        <div 
          ref={sliderRef}
          className='flex h-full'
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedImages.map((image, index) => (
            <img 
              key={index}
              className='w-full min-w-full object-cover h-full'
              src={image} 
              alt={`Hero slide ${index}`} 
            />
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index + 1 ? 'bg-white' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero
