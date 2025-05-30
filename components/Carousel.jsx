import React from 'react';
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Inter } from "next/font/google";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

// Animation variants for the carousel
const carouselVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Animation for navigation buttons
const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
  tap: { scale: 0.9 },
};

const CarouselComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const totalSlides = 2;

  // Auto-slide effect
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [paused]); // Only depends on paused state

  // Function to go to a specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Function to go to the next slide
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Function to go to the previous slide
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  return (
    <motion.div
      className="bg-white backdrop-blur-md py-12 md:py-16 flex justify-center h-auto px-6 z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={carouselVariants}
    >
      <div className="w-full max-w-5xl relative">
        <Carousel>
          <CarouselContent
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <CarouselItem className="flex flex-col px-6 md:px-12 w-full">
              <div className="flex flex-col gap-4 justify-center items-center text-center">
                <motion.h1
                  className={`${inter.className} text-2xl md:text-3xl font-semibold text-indigo-300`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Why Should We Use Scholarly?
                </motion.h1>
                <motion.p
                  className={`${inter.className} text-gray-700 leading-relaxed max-w-3xl`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Research articles are the source of knowledge in their respective fields. They shape our understanding and lay the foundation for future studies. Scientists and researchers read hundreds of articles over their careers to write reviews, grants, or publish findings. However, some challenges remain unaddressed.
                </motion.p>
              </div>
              <ul className={`${inter.className} list-disc pl-6 text-gray-500 mt-4 space-y-2`}>
                <li>Pulling out an old article with specific content is a herculean task. Can this be made easier?</li>
                <li>Can we reduce the knowledge gap between an experienced PI and an enthusiastic student?</li>
                <li>Readers highlight content, but the reason behind their highlights is hard to recollect later. Can users track their reasoning?</li>
                <li>Can experienced scientists help students learn to ask the right questions, enhancing research outcomes?</li>
                <li>Researchers spend hours organizing data from articles. Can we cut down time spent on mundane tasks?</li>
                <li>The solution to all these challenges is Scholarly.</li>
              </ul>
            </CarouselItem>
            <CarouselItem className="flex flex-col gap-4 px-6 md:px-12 w-full">
              <motion.h1
                className={`${inter.className} text-2xl md:text-3xl font-semibold text-indigo-300 text-center`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                How Should I Use Scholarly?
              </motion.h1>
              <ul className={`${inter.className} list-disc pl-6 text-gray-700 space-y-2`}>
                <li>Sign in with your basic information.</li>
                <li>Upload a PDF file of the article or pull the full text from PubMed by entering the required information.</li>
                <li>Highlight text using your mouse and right-click to add annotations and tags. Annotations can include relevant questions, reasoning, or notes (editable later with community support).</li>
                <li>Note: Framing a question relevant to your highlights helps with memory retention.</li>
                <li>Save the annotation to your database.</li>
                <li>Invite peers to read your annotations via email or share publicly to help others understand the article better.</li>
              </ul>
            </CarouselItem>
          </CarouselContent>

          {/* Navigation Buttons */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <CarouselPrevious
              onClick={goToPrevSlide}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 border-none rounded-full p-3 shadow-lg"
            />
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <CarouselNext
              onClick={goToNextSlide}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 border-none rounded-full p-3 shadow-lg"
            />
          </motion.div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index
                    ? "bg-indigo-500 scale-125"
                    : "bg-gray-400"
                } transition-all duration-300`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </motion.div>
  );
};

export default CarouselComponent;