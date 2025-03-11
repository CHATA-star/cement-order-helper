
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
      {/* Cross symbolizing faith */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/3 h-2/3 bg-cement-600 rounded-sm"></div>
        <div className="w-2/3 h-1/3 bg-cement-600 rounded-sm"></div>
      </div>
      
      {/* Circular foundation - representing team unity */}
      <div className="absolute inset-0 border-4 border-cement-500 rounded-full"></div>
      
      {/* Building block elements - representing strength */}
      <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/5 bg-cement-800 rounded-sm transform -rotate-45"></div>
      <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/5 bg-cement-800 rounded-sm transform rotate-45"></div>
      
      {/* Center dot - representing core values */}
      <div className="absolute inset-0 m-auto w-1/6 h-1/6 bg-cement-300 rounded-full"></div>
    </div>
  );
};

export default ChataCimentLogo;
