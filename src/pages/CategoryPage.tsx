import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getCategory } from "@/data/categories";
import { getProductsByCategory } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { useSeo } from "@/hooks/useSeo";

export function CategoryPage() {
  const { category: categoryId } = useParams();
  const category = getCategory(categoryId);

  useSeo(category ? `/collection/${category.id}/` : "/", category?.id);

  if (!category) return <Navigate to="/" replace />;

  const Icon = category.icon;
  const products = getProductsByCategory(category.id);

  return (
    <section className="min-h-[70vh] bg-[#fbf8f2] px-5 pb-20 pt-12 md:px-8 md:pt-16">
      <div className="mx-auto max-w-7xl">
        <Link to="/#collection" className="inline-flex items-center gap-2 text-xs text-[#927c66] hover:text-[#a16d4e]"><ArrowLeft size={14}/> Todas las colecciones</Link>
        <header className="my-10 max-w-2xl">
          <span className="eyebrow"><Icon size={14}/>{category.eyebrow}</span>
          <h1 className="mt-3 font-display text-5xl text-[#2d403c]">{category.name}</h1>
          <p className="mt-3 text-sm leading-7 text-[#817363]">{category.blurb}</p>
        </header>
        {category.banner && category.image && (
          <div className={`mb-10 overflow-hidden rounded-3xl border border-[#e0d3c3] bg-gradient-to-br ${category.accent}`}>
            <img
              src={category.image}
              alt={category.imageAlt ?? category.name}
              width={category.imageWidth}
              height={category.imageHeight}
              className={`h-[240px] w-full md:h-[340px] ${category.imageFit === "contain" ? "object-contain p-8" : "object-cover"}`}
            />
          </div>
        )}
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product, i) => <ProductCard key={product.id} product={product} index={i}/>)}</div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d9cbbb] bg-[#f4ede3] px-6 py-16 text-center">
            <Sparkles className="mx-auto text-[#ad8969]" size={28} strokeWidth={1.2}/>
            <h2 className="mt-5 font-display text-3xl text-[#344640]">Estamos preparando esta colección</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#817363]">Pronto encontrarás aquí nuestra selección de {category.name.toLowerCase()}. Mientras tanto, puedes descubrir el resto del universo Stellaris.</p>
            <Link to="/#collection" className="button-primary mt-7">Volver a las colecciones</Link>
          </div>
        )}
      </div>
    </section>
  );
}
