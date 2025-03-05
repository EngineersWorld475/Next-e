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
      <div className="flex flex-col justify-center items-center relative w-full md:w-max lg:w-max bg-white p-6 md:rounded-lg shadow-md md:mx-20 lg:mx-20 md:my-10 lg:my-10">
        <div className="object-cover mb-3">
          <img src={'/images/scholarly-logo-auth.png'} alt="scholarly-logo-auth" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

