
import React from "react";

interface ChataCimentLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const ChataCimentLogo = ({ size = "md", className = "" }: ChataCimentLogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Cross symbolizing faith in God */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/4 h-3/4 bg-gradient-to-b from-cement-600 to-cement-700 rounded-sm"></div>
        <div className="w-2/3 h-1/4 bg-gradient-to-r from-cement-600 to-cement-700 rounded-sm"></div>
      </div>
      
      {/* Circular foundation - representing unity and eternity */}
      <div className="absolute inset-0 border-4 border-cement-500 rounded-full border-opacity-80 shadow-inner"></div>
      
      {/* Radiant light from cross - divine guidance */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial from-orange-200 to-transparent opacity-40 rounded-full"></div>
      </div>
      
      {/* Building blocks - representing strength and construction */}
      <div className="absolute bottom-1/5 left-1/5 w-3/5 h-1/6 bg-gradient-to-r from-cement-800 to-cement-700 rounded-sm transform -rotate-45"></div>
      <div className="absolute bottom-1/5 right-1/5 w-3/5 h-1/6 bg-gradient-to-l from-cement-800 to-cement-700 rounded-sm transform rotate-45"></div>
      
      {/* Triangle pointing upward - aspirations and faith */}
      <div className="absolute bottom-2/5 left-1/3 w-1/3 h-1/4 bg-gradient-to-t from-amber-600 to-orange-500 clip-path-triangle"></div>
      
      {/* Outer glow - representing customer engagement and warmth */}
      <div className="absolute -inset-1 bg-gradient-radial from-amber-300 to-transparent opacity-20 rounded-full blur-sm"></div>
      
      {/* Center dot - representing core values and spirit */}
      <div className="absolute inset-0 m-auto w-1/6 h-1/6 bg-gradient-radial from-amber-300 to-amber-500 rounded-full"></div>
    </div>
  );
};

export default ChataCimentLogo;
