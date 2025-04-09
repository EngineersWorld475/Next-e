import React from 'react'
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const CarouselComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const totalSlides = 2; 

  // Auto-slide effect
  useEffect(() => {

    if(paused) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentSlide, paused]); // Runs every time currentSlide changes

  // Function to go to the next slide
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Function to go to the previous slide
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  return (
    <div className="bg-gray-200 flex justify-center py-10 h-full md:h-auto lg:h-auto p-3 z-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="w-full max-w-4xl relative">
        <Carousel>
          <CarouselContent
            className="flex transition-transform duration-700"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <CarouselItem className="flex flex-col px-6 w-full">
              <div className="flex flex-col gap-3 justify-center items-center">
                <h1 className={`${inter.className} text-3xl font-semibold text-[#ff6347]`}>Why should we use Scholarly?</h1>
                <p className={`${inter.className} text-gray-600 mb-3`}>Research articles are the source of knowledge in respective field of study. The information these research studies encompass shapes our understanding or lay foundation for future studies. Scientists and researchers read through hundreds of articles over their careers in the process of writing reviews, grants or publish their research findings. Unknowingly throughout this research career a vast information has been imbibed but at the same time some challenges are left unaddressed</p>
              </div>
              <ul className={`${inter.className} list-disc pl-5 text-customGrayBlue`}>
                <li>Pulling out an old article with specific content is a herculean task. Can this be made easier?</li>
                <li>There is a gap in understanding an article information between an experienced PI and his enthusiastic student? Can we reduce the knowledge gap?</li>
                <li>Readers highlight article content that interests them, the reason behind their highlight just stays in his/her thought while reading the article and when he revisits the article it’s hard to recollect the reason he highlighted the content? Can user track their reasoning?</li>
                <li>
                  Most of the research findings are a result of asking the right question and addressing it. Ability to ask the right question is limited by understanding of the subject. Can an experienced scientist help the students to learn asking the right questions?
                </li>
                <li>
                  Researchers spend hours on mining data from research article but spend hours organizing their content. Can we cut down time spent on mundane task of organizing?
                </li>
                <li>
                  The solution to all the challenges above is Scholarly.
                </li>
              </ul>
            </CarouselItem >
            <CarouselItem className="flex flex-col gap-3 px-6 w-full">
              <h1 className={`${inter.className} text-3xl font-semibold text-[#ff6347] text-center`}>How should I use Scholarly?</h1>
              <ul className={`${inter.className} list-disc pl-5 text-customGrayBlue`}>
                <li>Sign-in with your basic information</li>
                <li>Upload a PDF file of the article ( If full text of the article is available on Pubmed enter the required information to pull the full text of the article)</li>
                <li>Using mouse select text to highlight the content and right click to enter relevant annotation and tags.
                  Relevant annotation can include an appropriate question the content address or few sentences that reasons why you highlighted it or other reasoning you feel appropriate (Don’t worry spending time on what to write, you can always edit and there is a large benevolent community to help you phrase appropriately).</li>
                <li>
                  Note: We encourage framing a question relevant to your highlights because it is easier for our brain to remember something with a question and answer context.
                </li>
                <li>
                  Save the annotation to your database
                </li>
                <li>
                  Finally, you can invite your fellow peers to read your annotations sending an invitation by email or you can share publicly to help other readers to read article with your annotations and help them understand the content of the article better with some context of annotations.
                </li>
              </ul>
            </CarouselItem>
          </CarouselContent>

          {/* Navigation Buttons (Now Fully Working) */}
          <CarouselPrevious onClick={goToPrevSlide} className="bg-gray-500 border-none" />
          <CarouselNext onClick={goToNextSlide} className="bg-gray-500  border-none" />
        </Carousel>
      </div>
    </div>
  )
}

export default CarouselComponent
