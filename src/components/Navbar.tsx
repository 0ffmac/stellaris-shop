import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ShoppingBag, Sparkles } from "lucide-react";

const links = [
  { to: "/#collection", label: "Colecciones" },
  { to: "/#about", label: "Nuestra historia" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55 }}
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-[#ded2c3] bg-[#f7f2e9]/95 shadow-sm backdrop-blur-lg" : "border-[#e9dfd2] bg-[#fbf8f2]"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Stellaris, inicio">
          <span className="brand-star">✳</span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.85rem] tracking-tight text-[#253b39]">Stellaris</span>
            <span className="mt-1 text-[9px] uppercase tracking-[.22em] text-[#8d7764]">Paper · Objects · Rituals</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link to="/" className="nav-link">Inicio</Link>
          {links.map((link) => <Link key={link.label} to={link.to} className="nav-link">{link.label}</Link>)}
        </nav>

        <div className="hidden items-center gap-4 text-[#354744] sm:flex">
          <button className="icon-button" aria-label="Buscar (próximamente)" title="Búsqueda próximamente"><Search size={18}/></button>
          <button className="icon-button" aria-label="Cesta (próximamente)" title="Cesta próximamente"><ShoppingBag size={18}/></button>
          <span className="hidden text-[10px] uppercase tracking-widest text-[#8b7765] xl:inline">ES · EUR</span>
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-full p-2 text-[#354744] lg:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[#e6dbce] bg-[#fbf8f2] lg:hidden">
            <div className="flex flex-col gap-1 px-6 py-4">
              <Link onClick={() => setOpen(false)} to="/" className="mobile-link">Inicio</Link>
              {links.map((link) => <Link key={link.label} onClick={() => setOpen(false)} to={link.to} className="mobile-link">{link.label}</Link>)}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
