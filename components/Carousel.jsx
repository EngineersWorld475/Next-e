import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Users, Lightbulb, TrendingUp, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const CarouselComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: BookOpen,
      title: "Smart Annotations",
      description: "Revolutionary annotation system that learns from your reading patterns and suggests relevant insights.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-900/20 to-cyan-900/20"
    },
    {
      icon: Users,
      title: "Collaborative Research",
      description: "Connect with researchers worldwide and build knowledge together through shared annotations.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-900/20 to-pink-900/20"
    },
    {
      icon: Lightbulb,
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions and discover connections between papers you never noticed before.",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-900/20 to-orange-900/20"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your research journey with detailed analytics and personalized reading recommendations.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-900/20 to-emerald-900/20"
    },
    {
      icon: Award,
      title: "Research Excellence",
      description: "Elevate your research quality with tools designed by scientists, for scientists.",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-900/20 to-purple-900/20"
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Access your annotations and insights from anywhere, anytime, on any device.",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-900/20 to-blue-900/20"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features for Modern Research
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how Scholarly transforms your research experience with cutting-edge tools
          </p>
        </motion.div>

        <div className="relative">
          {/* Main carousel container */}
          <div className="relative h-96 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: [0.25, 0.25, 0, 1] }}
                className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgGradient} flex items-center justify-center p-12`}
              >
                <div className="text-center max-w-4xl">
                  {/* Render icon as element */}
                  {(() => {
                    const Icon = slides[currentSlide].icon;
                    return (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`w-24 h-24 mx-auto mb-8 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-3xl flex items-center justify-center shadow-2xl`}
                      >
                        <Icon className="w-12 h-12 text-white" />
                      </motion.div>
                    );
                  })()}

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-6"
                  >
                    {slides[currentSlide].title}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg md:text-xl lg:text-xl text-gray-200 leading-relaxed"
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Slide indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? `bg-gradient-to-r ${slides[currentSlide].gradient} shadow-lg scale-125`
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Feature grid below carousel */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {slides.slice(0, 3).map((slide, index) => {
            const Icon = slide.icon;
            return (
              <motion.div
                key={index}
                className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${slide.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{slide.title}</h4>
                <p className="text-gray-300 text-sm">{slide.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CarouselComponent;
