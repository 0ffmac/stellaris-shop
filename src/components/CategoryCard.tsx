import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/categories";

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  const Icon = category.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .45, delay: index * .06 }}>
      <Link to={`/collection/${category.id}/`} className="category-tile">
        <div className={`category-art bg-gradient-to-br ${category.accent}`}>
          {category.image ? <img src={category.image} alt={category.imageAlt ?? category.name} width={category.imageWidth} height={category.imageHeight} loading="lazy" className={`${category.imageFit === "contain" ? "object-contain p-6" : "object-cover"} h-full w-full`}/> : <div className="flex h-full items-center justify-center text-[#78634f]"><Icon size={52} strokeWidth={1.1}/></div>}
          <span className="category-arrow"><ArrowUpRight size={17}/></span>
        </div>
        <div className="px-1 pt-4"><p className="eyebrow">{category.eyebrow}</p><h3 className="mt-1 font-display text-2xl text-[#2d403c]">{category.name}</h3><p className="mt-1 text-sm text-[#847565]">{category.blurb}</p></div>
      </Link>
    </motion.div>
  );
}
