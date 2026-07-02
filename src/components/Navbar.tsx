import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#products", label: "Collection" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-stone-950/80 backdrop-blur-xl border-b border-stone-800/60 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#hero" className="flex items-center gap-2 text-lg font-display tracking-wider text-stone-100">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Stellaris
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-stone-400 hover:text-amber-300 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            className="text-xs uppercase tracking-[0.15em] px-5 py-2 rounded-full border border-amber-700/50 text-amber-300 hover:bg-amber-900/30 hover:border-amber-600 transition-all duration-300"
          >
            Shop Now
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-stone-300">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-stone-950/95 backdrop-blur-xl border-t border-stone-800/60"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] text-stone-400 hover:text-amber-300"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#products"
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.15em] text-amber-300"
              >
                Shop Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
