import React, { useState, useEffect } from 'react';
import { HERO_SLIDES } from '../../constants';
import { usePopup } from '../../contexts/PopupContext';

const HeroSlideshow: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { openPopup } = usePopup();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
        }, 7000); // Change slide every 7 seconds

        return () => clearInterval(intervalId);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const currentSlide = HERO_SLIDES[currentIndex];

    return (
        <div className="absolute inset-0 overflow-hidden">
            {HERO_SLIDES.map((slide, index) => (
                <div
                    key={index}
                    className="w-full h-full absolute inset-0 transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
                >
                    <img
                        src={slide.imageUrl}
                        alt={`Omkar International School campus slide ${index + 1}`}
                        className={`w-full h-full object-cover ${currentIndex === index ? 'animate-slideshow-kenburns' : ''}`}
                    />
                </div>
            ))}
             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4">
                <div key={currentIndex} className="animate-text-fade-in-from-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                       {currentSlide.quote}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-amber-300 max-w-3xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                        {currentSlide.subQuote}
                    </p>
                </div>
                 <button 
                    onClick={openPopup} 
                    className="btn-shine mt-12 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-extrabold py-4 px-10 rounded-full text-xl hover:from-amber-300 hover:to-amber-500 transition-all transform hover:scale-110 duration-300 shadow-xl animate-fade-in-up"
                    style={{ animationDelay: '0.6s' }}
                >
                    Admissions Open 2026-27
                </button>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {HERO_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-amber-400 scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlideshow;