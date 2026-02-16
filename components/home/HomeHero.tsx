'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1600&auto=format&fit=crop', // Baby clothing/sleep
        title: 'Peaceful Sleep for Little Dreamers',
        subtitle: 'Discover our premium collection of organic sleepwear and bedding.',
        cta: 'Shop Sleep',
        link: '/shop/sleep'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1596464716127-f9a8759d1b28?q=80&w=1600&auto=format&fit=crop', // Toys/Play
        title: 'Splish, Splash, Snuggle',
        subtitle: 'Gentle bathtime essentials for delicate skin.',
        cta: 'Shop Bathtime',
        link: '/shop/bathtime'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1600&auto=format&fit=crop', // Bedroom/Nursery
        title: 'Play & Learn',
        subtitle: 'Toys designed to spark imagination and development.',
        cta: 'Shop Toys',
        link: '/shop/toys'
    }
];

export default function HomeHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[80vh] min-h-[600px] overflow-hidden bg-gray-100">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent z-10" />

                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}

            {/* Content */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-xl text-white space-y-6">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-4">
                            {slides[currentSlide].title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-100 mb-8 font-light">
                            {slides[currentSlide].subtitle}
                        </p>
                        <Link
                            href={slides[currentSlide].link}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-rose-50 transition-colors shadow-lg"
                        >
                            {slides[currentSlide].cta}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
