import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { catalog } from "@/data/catalog";

export function StarCollectionSection() {
  const stars = catalog.filter((product) => product.category === "stars").slice(0, 6);
  return (
    <section className="bg-[#f1e8dc] px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-3"><Sparkles size={13}/> Nuestra colección original</p>
            <h2 className="section-title">21 estrellas, <em>21 personalidades.</em></h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#817363]">Descubre los modelos que forman parte de la colección Stellaris. Cada fotografía corresponde a una estrella de tu catálogo.</p>
          </div>
          <Link to="/collection/stars/" className="button-secondary w-fit">Ver los 21 modelos <ArrowRight size={15}/></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stars.map((star, i) => (
            <Link to="/collection/stars/" key={star.id} className="group overflow-hidden rounded-2xl border border-[#e0d3c3] bg-[#fbf8f2]">
              <div className="aspect-[3/4] overflow-hidden bg-[#e9dfd1]">
                <img src={star.image} alt={star.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/>
              </div>
              <div className="p-3">
                <p className="text-[9px] uppercase tracking-[.18em] text-[#a17656]">Colección Stellaris</p>
                <p className="mt-1 font-display text-lg text-[#30443f]">{star.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
