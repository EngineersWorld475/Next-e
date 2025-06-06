import { Brain, Sparkles, Target } from "lucide-react";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#f3f4f6]">
      {/* Mobile Navbar */}
      <div className="md:hidden relative flex items-center justify-center w-full h-20 bg-gradient-to-r from-indigo-700 to-purple-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('/images/auth-background-img.avif')`
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/80 to-purple-600/80 z-10" />
        
        <div className="absolute left-4 text-purple-100/30 z-20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute right-4 text-indigo-100/30 z-20">
          <Brain className="w-6 h-6" />
        </div>
        
        <div className="flex items-center justify-center z-20">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300">
              Scholarly
            </span>
          </h1>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col md:flex-row min-h-screen md:items-center md:justify-center">
        <div className="hidden md:flex relative items-center justify-center w-full md:w-1/3 h-screen bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: `url('/images/auth-background-img.avif')`
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/80 to-purple-600/80 hover:from-indigo-600/80 hover:to-purple-700/80 z-10 transition-all duration-300" />
          
          <div className="absolute top-20 left-10 text-purple-100/30 z-20">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute top-20 right-20 text-indigo-100/30 z-20">
            <Brain className="w-10 h-10" />
          </div>
          <div className="absolute bottom-40 left-20 text-pink-100/30 z-20">
            <Target className="w-10 h-10" />
          </div>
          
          <div className="flex flex-col items-center justify-center z-20">
            <h1 className="text-5xl font-extrabold tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300">
                Scholarly
              </span>
            </h1>
            <p className="text-pretty font-medium tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300">
                Making research accessible and collaborative
              </span>
            </p>
            <p className="text-pretty font-medium tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300">
                for everyone
              </span>
            </p>
          </div>
        </div>
        
        {/* Right Section - Content Area */}
        <div className="w-full md:w-2/3 min-h-[calc(100vh-5rem)] md:h-screen bg-white flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;