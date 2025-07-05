
'use client'
import CarouselComponent from "@/components/Carousel";
import Navbar from "@/components/Navbar";
import SummaryStats from "@/components/SummaryStats";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Users, Brain, Target, Heart } from "lucide-react";
import Image from "next/image";

// Enhanced animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1],
      staggerChildren: 0.1
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  tap: { scale: 0.95 },
};

export default function Home() {
  const [openFeedbackDialogue, setOpenFeedbackDialogue] = useState(false);

  return (
    <>
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        <div className="relative z-30">
          <Navbar />
        </div>
        {/*background elements */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
        </div>


        {/* Feedback button */}
        <div
          variants={buttonVariants}
          className="fixed top-1/3 right-10 z-20"
        >
          <Button
            onClick={() => setOpenFeedbackDialogue(true)}
            className="transform -translate-y-1/3 rotate-90 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-all duration-300 origin-bottom-right px-4 py-2 rounded-full"
          >
            Feedback
          </Button>
        </div>

        {/* Hero Section */}
        <motion.div
          className="relative flex flex-col justify-center items-center min-h-screen gap-8 text-center px-6 pt-10 pb-19 -mt-10"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          {/* decorative elements */}
          <motion.div
            className="absolute top-20 left-10 text-purple-400/30"
            // animate={{ y: [0, -15, 0] }}
            // transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>

          <motion.div
            className="absolute top-40 right-20 text-indigo-400/30"
            // animate={{ rotate: [0, 15, -15, 0] }}
            // transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Brain className="w-6 h-6" />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-20 text-pink-400/30"
            // animate={{ scale: [1, 1.2, 1] }}
            // transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Target className="w-10 h-10" />
          </motion.div>


          <motion.div variants={itemVariants} className="relative">
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.25, 0, 1] }}
            >
              <span className="block text-white drop-shadow-2xl">Welcome to</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 animate-pulse">
                Scholarly
              </span>
            </motion.h1>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <motion.p
              className="text-xl sm:text-2xl md:text-3xl text-gray-100 leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <span className="block mb-2">"A good scientist knows the right answers.</span>
              <span className="block mb-4 text-purple-300">A great scientist knows the right questions."</span>
              <span className="block text-lg italic text-gray-300">— Claude Lévi-Strauss</span>
            </motion.p>
          </motion.div>
        </motion.div>

        {/* What is Scholarly - Modernized */}
        <motion.div
          className="relative backdrop-blur-xl bg-gradient-to-r from-slate-800/50 to-purple-800/30 py-20 border-y border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    What is Scholarly?
                  </h2>
                </div>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Scholarly is a cutting-edge research article annotation tool that revolutionizes how scientists interact with academic literature. Our platform provides an intuitive analytical dashboard for organizing, tracking, and retrieving insights from research papers.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-full text-sm font-medium border border-violet-500/30">Interactive Reading</span>
                  <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">Collaborative Annotations</span>
                  <span className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30">Advanced Analytics</span>
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className="w-full h-80 bg-white rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Image src="/images/annotation-img.jpg" alt="annotation-image" className="rounded-2xl" width={600} height={500} />

                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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

        {/* Who Should Use Scholarly */}
        <motion.div
          className="relative backdrop-blur-xl bg-gradient-to-l from-indigo-800/50 to-slate-800/30 py-20 border-y border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={itemVariants}
                className="relative order-2 lg:order-1"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className="w-full h-80 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="object-contain">
                      <Image src="/images/searching-img.jpg" alt="searching-image" width={600} height={200} />
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-6 order-1 lg:order-2">
                <div className="relative flex gap-3 mb-6">
                  <div className="w-16 h-10 md:w-14 md:h-12 lg:w-14 lg:h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mt-1.5">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Who Should Use Scholarly?
                  </h2>
                </div>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Perfect for researchers, students, and scientists across all disciplines. Whether you're diving deep into complex papers or seeking collaborative insights, Scholarly transforms your reading experience with intelligent annotation tools.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-indigo-300 font-semibold mb-2">Students</h4>
                    <p className="text-gray-300 text-sm">Enhance comprehension and retention</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-indigo-300 font-semibold mb-2">Researchers</h4>
                    <p className="text-gray-300 text-sm">Streamline literature review process</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Who Are We */}
        <motion.div
          className="relative bg-gradient-to-br from-white via-gray-50 to-purple-50 py-20 text-gray-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Who Are We?
                  </h2>
                </div>
                <p className="text-xl text-gray-700 leading-relaxed">
                  We're research scientists who understand your journey. Our mission is to make academic reading more intuitive and collaborative, believing that true understanding comes through active engagement with literature.
                </p>
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border border-purple-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Our Vision</h4>
                    <p className="text-gray-600">Making research accessible and collaborative for everyone</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-200">
                  <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Heart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-700 text-lg font-medium">Built with Passion</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
        <footer className="relative bg-gradient-to-t from-slate-900 via-purple-900/50 to-slate-800 py-2 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Scholarly</span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                Empowering researchers worldwide with intelligent annotation tools
              </p>
              <p className="text-gray-500 text-xs">
                Copyright © 2025 Scholarly Web Book.
              </p>
            </motion.div>
          </div>
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
