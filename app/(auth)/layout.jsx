import React, { ReactNode } from "react";

const AuthLayout = ({ children }) => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-[#f3f4f6]"
      style={{backgroundImage: "url('/images/forms-layout-background-image.jpg')" }}
    >
      {/* Overlay for fading effect */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Auth Card (remains fully visible) */}
      <div className="relative w-full md:w-1/2 lg:w-1/2 bg-white p-6 md:rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

