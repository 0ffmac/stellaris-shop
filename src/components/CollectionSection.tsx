import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";

export function CollectionSection() {
  return (
    <section id="collection" className="section-pad bg-[#fbf8f2]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-3">El universo Stellaris</p>
            <h2 className="section-title">Encuentra algo <em>especial.</em></h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#817363]">Una selección de objetos para regalar, decorar y crear pequeños momentos propios.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const wide = index === 0 || index === 1;
            return (
              <motion.article key={category.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .45, delay: index * .06 }} className={`group ${wide ? "lg:col-span-3" : "lg:col-span-2"}`}>
                <Link to={`/collection/${category.id}/`} className="category-tile">
                  <div className={`category-art bg-gradient-to-br ${category.accent}`}>
                    {category.image ? <img src={category.image} alt={category.imageAlt ?? category.name} width={category.imageWidth} height={category.imageHeight} loading="lazy" className={`${category.imageFit === "contain" ? "object-contain p-7" : "object-cover"} h-full w-full transition duration-700 group-hover:scale-[1.04]`}/> : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-[#78634f]">
                        <Icon size={54} strokeWidth={1.05}/>
                        <span className="text-[10px] uppercase tracking-[.22em]">{category.id === "incense" ? "Aromas naturales" : "Textiles con carácter"}</span>
                      </div>
                    )}
                    <span className="category-arrow"><ArrowUpRight size={17}/></span>
                  </div>
                  <div className="px-1 pb-2 pt-4">
                    <p className="text-[9px] uppercase tracking-[.2em] text-[#a17a5d]">{category.eyebrow}</p>
                    <h3 className="mt-1 font-display text-2xl text-[#2d403c]">{category.name}</h3>
                    <p className="mt-1 max-w-md text-sm leading-5 text-[#847565]">{category.blurb}</p>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
