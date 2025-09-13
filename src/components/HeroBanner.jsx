import React, { useState } from "react";
const bannerImg = "../../public/assets/bannerImg.JPG";
const bb = "../../public/assets/outdoor/outdoor1.mp4";

const HeroBanner = () => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Video or fallback image */}
      {!videoError ? (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
        >
          <source src={bb} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={bannerImg}
          alt="Hero Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
          draggable={false}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-8 max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-light tracking-widest">ELITE ESTATES</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-2"></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Discover Your{" "}
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Dream
          </span>{" "}
          Property
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Luxury homes in the most desirable locations. Experience the
          difference of premium real estate service.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
            View Properties
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
            Schedule a Tour
          </button>
        </div>

        <div className="animate-bounce">
          <p className="text-gray-400 mb-2 text-sm">Explore listings</p>
          <svg
            className="w-8 h-8 mx-auto text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="w-16 h-16 rounded-full bg-amber-500 opacity-20 animate-pulse"></div>
      </div>
      <div className="absolute top-1/4 left-10 hidden lg:block">
        <div className="w-10 h-10 rounded-full bg-white opacity-10"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
