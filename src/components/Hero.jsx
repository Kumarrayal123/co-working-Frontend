// import React from "react";
// import hero from "../assets/hero.jpg"


// function Hero() {
//   return (
//     <section className="hero-wrapper">
//       <div className="hero-content">
//         <h1>
//           Find Your Perfect <span>Workspace</span>
//         </h1>
//         <p>
//           Discover modern cabins, flexible co-working spaces, and private work pods
//           tailored for your needs.
//         </p>

//         <button className="hero-btn">Explore Spaces</button>
//       </div>

//       {/* Images */}
//       <img
//         src={hero}
//         alt="workspace"
//         className="hero-img-desktop"
//       />
//       <img
//         src="/images/hero-mobile.jpg"
//         alt="workspace mobile"
//         className="hero-img-mobile"
//       />
//     </section>
//   );
// }

// export default Hero;




import React from "react";
import { Star, Wifi, Clock, MapPin, ArrowRight } from "lucide-react";
import heroDesktop from "../assets/hero.jpg";
import heroMobile from "../assets/hero.jpg";

const HeroSection = () => {
  const trustBadges = [
    { icon: Star, text: "4.9/5 Google" },
    { icon: Wifi, text: "High-Speed Wi-Fi" },
    { icon: Clock, text: "24/7 Access" },
    { icon: MapPin, text: "Prime Location" },
  ];

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900 text-white rounded-b-3xl md:rounded-[2.5rem] mx-auto md:w-[98%] mt-2">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroDesktop}
          alt="Modern Workspace"
          className="w-full h-full object-cover opacity-60 hidden md:block"
        />
        <img
          src={heroMobile}
          alt="Modern Workspace Mobile"
          className="w-full h-full object-cover opacity-60 md:hidden"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Spaces Available Now
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6 animate-fade-in-up delay-100">
            Work, Create & Grow <br className="hidden md:block" />
            in a Space Designed for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Productivity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed animate-fade-in-up delay-200">
            Flexible workspaces, private cabins, and meeting rooms tailored for
            startups, freelancers, and growing teams. Join a community that inspires.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up delay-300">
            <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Book a Free Visit <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl transition-all transform hover:-translate-y-1">
              Check Pricing
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 animate-fade-in-up delay-400">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors"
                title={badge.text}
              >
                <badge.icon size={18} className="text-emerald-400" />
                <span className="text-sm font-medium text-gray-200 whitespace-nowrap">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-emerald-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
