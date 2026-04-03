import { useState } from "react";
import logo from "@/assets/rrcreatorlab-logo.png";

const PromoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <a
      href="https://rrcreatorlab.in"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[85%] max-w-[700px] bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-full flex items-center justify-between gap-3 shadow-lg z-[9999] no-underline transition-all duration-300 hover:scale-[1.01]"
    >
      <img src={logo} alt="RR Creator Lab" className="w-7 h-7 rounded-full object-cover" />
      <span className="flex-1 text-sm text-gray-700">
        This website is made by <b className="text-gray-900">RR Creator Lab</b>. Click to get your own 🚀
      </span>
      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap font-medium">
        ✨ Get Yours
      </span>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVisible(false); }}
        className="text-gray-400 hover:text-gray-600 text-base leading-none"
      >
        ✕
      </button>
    </a>
  );
};

export default PromoBanner;
