import React from "react";
import { Briefcase, Monitor, Sofa, Users, Mic } from "lucide-react";


const spaces = [
  {
    icon: Briefcase,
    title: "Private Cabins",
    description: "Dedicated private offices for focused work",
    capacity: "1–10 seats",
    price: "From $299/mo",
    availability: "available",
    popular: true,
  },
  {
    icon: Monitor,
    title: "Dedicated Desks",
    description: "Your own desk in our open workspace",
    capacity: "1 seat",
    price: "From $199/mo",
    availability: "available",
    popular: false,
  },
  {
    icon: Sofa,
    title: "Flexible Seating",
    description: "Hot desks for on-demand workspace",
    capacity: "Hourly / Daily",
    price: "From $25/day",
    availability: "limited",
    popular: false,
  },
  {
    icon: Users,
    title: "Meeting Rooms",
    description: "Professional spaces for client meetings",
    capacity: "4–20 people",
    price: "From $50/hr",
    availability: "available",
    popular: false,
  },
  {
    icon: Mic,
    title: "Podcast Studio",
    description: "Fully equipped recording studio",
    capacity: "2–4 people",
    price: "From $75/hr",
    availability: "limited",
    popular: false,
  },
];

const SpacesSection = () => {
  return (
    <section id="spaces" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
            Our Spaces
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Choose Your <span className="text-emerald-600">Space</span>
          </h2>
          <p className="text-lg text-gray-600">
            Find a workspace that fits your workflow and budget. Whether you need a private office or a hot desk, we have you covered.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaces.map((space, index) => (
            <div
              key={index}
              className={`group relative rounded-3xl p-8 transition-all duration-300 border ${space.popular
                ? "bg-white border-emerald-200 shadow-xl shadow-emerald-100 scale-100 md:scale-105 z-10"
                : "bg-gray-50 border-gray-100 shadow-sm hover:shadow-lg hover:bg-white hover:border-emerald-100"
                }`}
            >
              {space.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Most Popular
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${space.popular ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 shadow-sm'
                }`}>
                <space.icon size={28} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{space.title}</h3>
              <p className="text-gray-500 mb-6 line-clamp-2 min-h-[48px]">{space.description}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Capacity</span>
                  <span className="text-gray-900 font-bold">{space.capacity}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Availability</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${space.availability === "available" ? "bg-emerald-500 animate-pulse" : "bg-orange-400"}`}></span>
                    <span className={`font-semibold capitalize ${space.availability === "available" ? "text-emerald-600" : "text-orange-500"}`}>
                      {space.availability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">{space.price}</span>
                <button className={`p-2 rounded-full transition-all duration-300 ${space.popular
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-110 shadow-lg shadow-emerald-200"
                  : "bg-white text-gray-400 border border-gray-200 hover:border-emerald-500 hover:text-emerald-600"
                  }`}>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpacesSection;
