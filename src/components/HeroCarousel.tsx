import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroCarousel() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200',
      title: 'Discover Your Next Great Read',
      subtitle: 'Explore thousands of books across all genres',
      cta: 'Browse Collection'
    },
    {
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200',
      title: 'Bestsellers & New Arrivals',
      subtitle: 'Get the latest and most popular books',
      cta: 'Shop Now'
    },
    {
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200',
      title: 'Build Your Personal Library',
      subtitle: 'Curated collections for every reader',
      cta: 'Start Shopping'
    },
    {
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200',
      title: 'Special Offers Every Week',
      subtitle: 'Save on your favorite authors and genres',
      cta: 'View Deals'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ImageWithFallback
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-3xl px-4">
              <h1 className="text-white mb-4 animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-xl mb-8 animate-fade-in-delay">
                {slide.subtitle}
              </p>
              <Button
                onClick={() => navigate('/search')}
                size="lg"
                style={{ backgroundColor: '#CF8852' }}
                className="text-white hover:opacity-90 animate-fade-in-delay-2"
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            style={
              index === currentSlide
                ? { backgroundColor: '#CF8852' }
                : undefined
            }
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
