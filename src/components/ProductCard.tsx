import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CatalogProduct } from "@/data/catalog";

export function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  const href = `/collection/${product.category}/${product.id}/`;

  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4, delay: (index % 3) * .06 }} className="product-card">
      <Link to={href} className="group block">
        <div className={`relative overflow-hidden bg-[#eee5d9] ${product.imageAspect ?? "aspect-[4/3]"}`}>
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"/>
          {product.price !== undefined && <span className="absolute bottom-3 right-3 rounded-full bg-[#fbf8f2]/95 px-3 py-1.5 text-xs text-[#354742]">€{product.price.toFixed(2)}</span>}
        </div>
      </Link>
      <div className="p-5">
        <Link to={href}><h3 className="font-display text-2xl text-[#30443f] transition hover:text-[#a16d4e]">{product.name}</h3></Link>
        {product.benefit && <p className="mt-2 text-sm leading-5 text-[#817363]">{product.benefit}</p>}
        {product.zodiac && <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f0e8dc] px-3 py-1 text-[11px] text-[#776a5b]"><span style={{ color: product.accent }}>{product.zodiacSymbol}</span>{product.zodiac}</span>}
        {product.note && <p className="mt-3 text-xs leading-5 text-[#9a8977]">{product.note}</p>}
        {product.features && <ul className="mt-4 flex flex-wrap gap-2">{product.features.map((feature) => <li key={feature} className="rounded-full border border-[#e5dbcf] px-2.5 py-1 text-[10px] text-[#837564]">{feature}</li>)}</ul>}
        <Link to={href} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#cbb9a4] px-4 py-2.5 text-xs text-[#796b5b] transition hover:border-[#a9794f] hover:text-[#8e6242]">
          Ver detalle <ArrowRight size={14}/>
        </Link>
      </div>
    </motion.article>
  );
}
