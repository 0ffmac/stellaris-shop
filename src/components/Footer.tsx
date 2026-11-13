import { Instagram, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#f1e8dc] px-5 pb-8 pt-12 text-[#334541] md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-[#d9cbbb] pb-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2"><span className="brand-star">✳</span><span className="font-display text-3xl">Stellaris</span></Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#827363]">Un universo de objetos artesanales, luz, color y pequeños rituales para hacer tuyos tus espacios.</p>
        </div>
        <div>
          <h3 className="footer-heading">Explora</h3>
          <div className="flex flex-col gap-2 text-sm text-[#786b5d]">
            <Link to="/collection/stars/">Estrellas de papel</Link><Link to="/collection/lamps/">Lámparas turcas</Link><Link to="/collection/bracelets/">Pulseras y gemas</Link><Link to="/collection/incense/">Aromas y rituales</Link><Link to="/collection/textiles/">Tapices y textiles</Link>
          </div>
        </div>
        <div>
          <h3 className="footer-heading">Estamos cerca</h3>
          <p className="text-sm leading-6 text-[#786b5d]">¿Tienes alguna pregunta sobre un producto o un pedido? Escríbenos y te ayudaremos.</p>
          <div className="mt-4 flex gap-4 text-[#52645c]"><a href="mailto:hola@stellaris-shop.com" aria-label="Email"><Mail size={19}/></a><a href="#" aria-label="Instagram"><Instagram size={19}/></a></div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 pt-6 text-[10px] tracking-wide text-[#988875] sm:flex-row"><span>© {new Date().getFullYear()} Stellaris. Todos los derechos reservados.</span><span>Made with care · España</span></div>
    </footer>
  );
}
