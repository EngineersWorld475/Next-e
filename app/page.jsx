'use client'
import CarouselComponent from "@/components/Carousel";
import Navbar from "@/components/Navbar";
import SummaryStats from "@/components/SummaryStats";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Animation for the feedback button
const buttonVariants = {
  hover: { scale: 1.05, rotate: 90, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function Home() {
  const [openFeedbackDialogue, setOpenFeedbackDialogue] = useState(false);

  return (
    <>
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <Navbar />
        {/* Feedback button with animation */}
        <div
          variants={buttonVariants}
          className="fixed top-1/3 right-8 z-20"
        >
          <Button
            onClick={() => setOpenFeedbackDialogue(true)}
            className="transform -translate-y-1/3 rotate-90 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-all duration-300 origin-bottom-right px-4 py-2 rounded-full"
          >
            Feedback
          </Button>
        </div>

        {/* Section 1 - Hero Section */}
        <motion.div
          className="flex flex-col justify-center items-center h-screen gap-6 text-center px-5 bg-gray-900/50 backdrop-blur-xl shadow-xl"
          style={{
            backgroundImage: "url('/images/blurred-cityscape.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight bg-gray-900/60 backdrop-blur-lg rounded-lg px-4 py-2 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="block sm:inline">Welcome to</span>{" "}
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Scholarly
            </span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed bg-gray-900/60 backdrop-blur-lg rounded-lg px-4 py-2 drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="block sm:inline">"A good scientist (or student) knows</span>
            <span className="block sm:inline">the right answers. A great scientist</span>
            <span className="block sm:inline">(or student) knows the right questions."</span>
            <span className="block sm:inline italic">— Claude Lévi-Strauss</span>
          </motion.p>
        </motion.div>

        {/* Section 2 - What is Scholarly */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md h-auto py-12 md:py-16 flex flex-col md:flex-row text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="w-full md:w-2/3 md:py-10 md:px-28 px-6 py-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-indigo-300 mb-4">
              What is Scholarly?
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Scholarly is a research article annotation tool that enhances a scientist’s ability to interactively read and understand research articles more effectively. It offers a unique analytical dashboard for users to organize, track, and retrieve content from research papers. Gain new insights by working in groups or allowing the public to review and improve your annotations.
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-center items-center px-6 py-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/annotation-img.jpg"
                alt="annotation-img"
                className="rounded-lg shadow-lg"
                width={500}
                height={500}
                priority
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <CarouselComponent />
        </motion.div>

        {/* Section 3 - Who Should Use Scholarly */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md h-auto py-12 md:py-16 flex flex-col md:flex-row text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="w-full md:w-1/3 flex justify-center items-center px-6 py-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/searching-img.jpg"
                alt="searching-img"
                className="rounded-lg shadow-lg"
                width={600}
                height={600}
              />
            </motion.div>
          </div>
          <div className="w-full md:w-2/3 md:py-10 md:px-28 px-6 py-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-indigo-300 mb-4">
              Who Should Use Scholarly?
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Do you read research articles? Have you ever missed a critical point in an article or understood it better after a discussion? If yes, Scholarly is for you! Designed for students, researchers, and scientists across all fields, Scholarly helps you gain new insights with a click of a button.
            </p>
          </div>
        </motion.div>

        {/* Section 4 - Who Are We */}
        <motion.div
          className="bg-white h-auto py-12 md:py-16 flex flex-col md:flex-row text-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="w-full md:w-2/3 md:py-10 md:px-28 px-6 py-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Who Are We and What Are We Up To?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We are research scientists who’ve walked your path. We believe understanding a research article depends on the reader’s subject knowledge. Seminars, webinars, and presentations are great, but reading and understanding an article sharpens analytical thinking. We aim to make reading and retaining information effortless.
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-center items-center px-6 py-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/personal-website-wp-img.jpg"
                alt="personal-website-weap-img"
                className="rounded-lg shadow-lg"
                width={500}
                height={500}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Section 5 - The Tool is Helpful */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md h-auto py-12 md:py-16 flex flex-col md:flex-row text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="w-full md:w-1/3 flex justify-center items-center px-6 py-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/helpful-sign-img.jpg"
                alt="searching-img"
                className="rounded-lg shadow-lg"
                width={500}
                height={500}
              />
            </motion.div>
          </div>
          <div className="w-full md:w-2/3 md:py-10 md:px-28 px-6 py-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-indigo-300 mb-4">
              The Tool is Helpful, But…?
            </h2>
            <p className="text-gray-200 leading-relaxed">
              We’re continually learning the needs of scientists and students, adding user-friendly features to keep you engaged. Your feedback is invaluable as we assess the service’s value to the community. Our goal is to keep Scholarly free and impactful. Don’t hesitate to reach out!
            </p>
          </div>
        </motion.div>

        {/* Summary Stats Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <SummaryStats />
        </motion.div>

        {/* Footer */}
        <footer className="flex justify-center items-center bg-gradient-to-t from-gray-900 to-gray-800 py-6">
          <p className="text-gray-400 text-sm">
            Copyright © Scholarly Web Book powered by xAI 2025
          </p>
        </footer>
      </div>

      {/* Feedback Sheet */}
      <Sheet
        open={openFeedbackDialogue}
        onOpenChange={() => setOpenFeedbackDialogue(false)}
      >
        <SheetContent
          side="right"
          className="overflow-auto bg-white/90 backdrop-blur-md text-black p-6 rounded-l-xl shadow-2xl w-full sm:w-96"
          aria-describedby="feedback-description"
        >
          <SheetTitle className="text-2xl font-semibold text-indigo-600">
            Feedback
          </SheetTitle>
          <motion.form
            action=""
            className="flex flex-col gap-4 mt-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <label htmlFor="message_type" className="block text-sm font-medium text-gray-700">
                Message Type
              </label>
              <select
                id="message_type"
                name="message_type"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 bg-white/50 transition-all duration-300"
                required
              >
                <option value="">Select</option>
                <option value="suggestion">Suggestion</option>
                <option value="request_new_feature">Request New Feature</option>
                <option value="bug_report">Bug Report</option>
                <option value="complement">Complement</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 bg-white/50 transition-all duration-300"
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email or UID
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 bg-white/50 transition-all duration-300"
                placeholder="Email or UID"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 transition-all duration-300"
                placeholder="Message"
              />
            </div>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 rounded-lg py-2 transition-all duration-300">
              Send
            </Button>
          </motion.form>
        </SheetContent>
      </Sheet>
    </>
  );
}