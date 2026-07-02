import { Sparkles } from "lucide-react";

const footerLinks = [
  { label: "Collection", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "X (Twitter)", href: "#" },
  { label: "Facebook", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-900/60">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-display text-lg tracking-wider text-stone-100">Stellaris</span>
            </div>
            <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs">
              Luxury celestial objects for the discerning. Crafted for those who
              command attention without seeking it.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-4 font-sans">Navigation</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-amber-400 transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-4 font-sans">Connect</h4>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-amber-400 transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600 font-light">
            &copy; {new Date().getFullYear()} Stellaris Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-stone-600">
            <a href="#" className="hover:text-stone-400 transition-colors">
              Terms &amp; Conditions
            </a>
            <a href="#" className="hover:text-stone-400 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
