export default function Footer() {
  return (
    <footer className="w-full py-10 bg-white border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between relative z-10">
        {/* Logo left */}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
          By{" "}
          <span className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            Da Silva Pereira Nollan
          </span>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
            Weathora
          </span>
        </div>

        {/* Right - signature */}

        {/* Centre - copyright */}
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
          © 2025 — Tous droits réservés
        </p>
      </div>

      {/* Ligne déco top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-slate-200" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </footer>
  );
}
