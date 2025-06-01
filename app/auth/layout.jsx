
import { Brain, Sparkles, Target } from "lucide-react";
import React, { ReactNode } from "react";


const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex flex-col md:flex-row min-h-screen items-center justify-center bg-cover bg-center bg-[#f3f4f6]">
      <div className="relative flex items-center justify-center w-full md:w-1/3 h-screen bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/80 to-purple-600/80 hover:from-indigo-600/80 hover:to-purple-700/80 z-10 transition-all duration-300" />

        {/* decorative elements */}
        <div className="absolute top-20 left-10 text-white">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute top-20 right-20 text-white">
          <Brain className="w-10 h-10" />
        </div>
        <div className="absolute bottom-40 left-20 text-white">
          <Target className="w-10 h-10" />
        </div>

        <div className="flex flex-col items-center justify-center">
          <h1 className="relative text-5xl font-extrabold tracking-tight z-20">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300">
              Scholarly
            </span>
          </h1>
          <p className="relative text-pretty font-medium tracking-tight z-20">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300">
              Making research accessible and collaborative
            </span>
          </p>
          <p className="relative text-pretty font-medium tracking-tight z-20">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300">
              for everyone
            </span>
          </p>
        </div>
      </div>

      <div className="w-2/3 h-screen bg-white flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
