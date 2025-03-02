'use client'
import CarouselComponent from "@/components/Carousel";
import Navbar from "@/components/Navbar";
import SummaryStats from "@/components/SummaryStats";

export default function Home() {

  return (
    <div>
      <Navbar />
      {/* section 1 */}
      <div className="flex flex-col justify-center items-center h-72 gap-3 shadow-md">
        <h1 className="text-4xl text-gray-700 font-semibold text-center mt-10">
          <span className="block sm:inline">Welcome to</span>
          <span className="block sm:inline"> Scholarly</span>
        </h1>
        <p className="text-customGrayBlue">
          <span className="block sm:inline">"A good scientist (or student) knows the</span>
          <span className="block sm:inline">right answers. A great scientist (or student)</span>
          <span className="block sm:inline"> knows the right questions." Author unknown</span>
        </p>
      </div>
      {/* section 2 */}
      <div className="bg-[#FCE8BD] h-full md:h-72 lg:h-72 flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 md:py-10 md:px-28 px-5 py-5">
          <p className="text-[#3a3a3a]">What is Scholarly?</p>
          <p className="w-full text-[#3a3a3a]">
            Scholarly is a research article annotation tool which enhances scientist’s ability to interactively read and understand a research article more effectively. It offers a unique analytical dashboard for users to organize, track and retrieve their content from research papers. You can acquire new insights by working in groups or allowing public to review or improve your annotations.
          </p>
        </div>
        <div className="w-full md:w-1/3 overflow-hidden object-cover">
          <img src={'/images/annotation-img.svg'} alt="annotation-img" className="px-10 py-5" />
        </div>
      </div>
      {/* carousel section */}
      <CarouselComponent />
      {/* section 3 */}
      <div className=" h-full md:h-72 lg:h-72 flex flex-col md:flex-row">
        <div className="flex justify-center items-center w-full md:w-1/3 md:py-10 md:px-28 overflow-hidden px-5 py-5 object-cover">
          <img src={'/images/searching-img.svg'} alt="searching-img" className="" />
        </div>
        <div className="flex flex-col gap-3 justify-center w-full md:w-2/3 overflow-hidden w-30 px-5 py-5">
          <h1 className="text-gray-600">Who should use Scholarly?</h1>
          <p className="w-full text-customGrayBlue">Do you read research articles? Have you ever faced a situation that you read an article but somehow missed “that point”? Did you ever fell that you understood an article better after discussion? If your answer is Yes, Scholarly is for you!! Scholarly is for students, researchers, and scientists in all fields of sciences who intend to acquire new insights with a click of a button.</p>
        </div>
      </div>
      {/* section 4 */}
      <div className="bg-[#FCE8BD] h-full md:h-72 lg:h-72 flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 md:py-10 md:px-28 px-5 py-5">
          <p className="text-[#3a3a3a]">Who are we and what are we up to?</p>
          <p className="w-full text-[#3a3a3a]">
            We are research scientists who traveled your path. We believe that the level of understanding of a research article varies with the experience in subject knowledge of the reader. Seminars, Webinars, and other presentations are our interactive avenues to learn about various research studies. However, reading and understanding an article grows our ability to think analytically.

            You probably heard this “Reading is active process and watching is passive process”. Reading requires lot of attention and all researcher can relate to this, we lose track of our article after reading 3 pages. This is what we would like to change, reading an article and retaining the information should be as easy as possible.


          </p>
        </div>
        <div className="w-full md:w-1/3 overflow-hidden object-cover">
          <img src={'/images/personal-website-wp-img.svg'} alt="personal-website-weap-img" className="px-10 py-5" />
        </div>
      </div>
      {/* section 5 */}
      <div className=" h-full md:h-72 lg:h-72 flex flex-col md:flex-row">
        <div className="flex justify-center items-center w-full md:w-1/3 md:py-7 md:px-10 overflow-hidden px-5 py-5 object-cover">
          <img src={'/images/helpful-sign-img.svg'} alt="searching-img" className="" />
        </div>
        <div className="flex flex-col gap-3 justify-center w-full md:w-2/3 overflow-hidden w-30 px-5 py-5">
          <h1 className="text-gray-600">The tool is helpful, but …?</h1>
          <p className="w-full text-customGrayBlue">We’re in process of understanding the needs of scientists and students. We’re constantly working in adding new user friendly features to engage the user interests. Your feedback and suggestions are appreciated. We are learning the costs to operate this service and whether it is adding value to the community. Our goal is to keep this service free and add value to the user. Don’t hesitate to drop an email.</p>
        </div>
      </div>
      {/* summary stats section */}
      <SummaryStats />
      {/* footer */}
      <footer className="flex justify-center items-center bg-gray-700">
        <p className="text-white py-5 text-sm">Copyright © Scholarly Web Book 2019</p>
      </footer>
    </div>
  );
}
