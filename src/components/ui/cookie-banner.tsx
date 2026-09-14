import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#111] text-white border-t border-gray-700 p-4 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Text */}
        <div className="flex-1">
          <p className="text-[13px] leading-relaxed text-gray-300">
            Nous utilisons des cookies pour vous offrir la meilleure expérience sur notre site.
            {" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[#f97316] hover:underline"
            >
              En savoir plus
            </a>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-[12px] font-mono tracking-widest uppercase border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors duration-200 rounded-md"
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-[12px] font-mono tracking-widest uppercase bg-[#f97316] text-white hover:bg-[#ea6b0a] transition-colors duration-200 rounded-md"
          >
            Accepter
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
