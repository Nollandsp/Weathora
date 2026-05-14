"use client";
import Image from "next/image";

export default function Header() {
  const handleScrollToForecast = () => {
    const target = document.getElementById("decouvrir");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("Element with id 'decouvrir' not found.");
    }
  };

  return (
    <header className="relative h-screen w-full overflow-hidden bg-white">
      {/* Image de fond */}
      <Image
        src="/nicolas-hippert-_7yudZhd6Cw-unsplash.jpg"
        alt="Landscape"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay moderne */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-4xl mx-auto">
        {/* Logo simple et élégant */}
        <a href="/index.html" className="group mb-8">
          <div className="relative   transition-all duration-300 hover:scale-105">
            <Image
              src="/Logo-Weathora.png"
              alt="Weathora"
              width={100}
              height={100}
              className="transition-all duration-300 mt-5"
            />
          </div>
        </a>

        <p className="text-xl md:text-2xl text-white/90 mb-4  font-bold">
          Votre météo de confiance
        </p>

        <p className="text-lg text-white/80 max-w-2xl leading-relaxed mb-12">
          Une interface claire et moderne pour vous accompagner au quotidien,
          qu'il pleuve ou qu'il fasse soleil.
        </p>

        <button
          onClick={handleScrollToForecast}
          className="group bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 hover:bg-gray-50 mb-20"
          type="button"
        >
          Découvrir la météo
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>

        {/* Badge de statut discret */}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}
