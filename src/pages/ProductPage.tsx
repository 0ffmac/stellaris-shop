import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, Mail, Maximize2, ShoppingBag, Sparkles,
} from "lucide-react";
import { getCategory } from "@/data/categories";
import { getProduct, getProductsByCategory } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ProductImageLightbox } from "@/components/ProductImageLightbox";
import { useSeo } from "@/hooks/useSeo";

export function ProductPage() {
  const { category: categoryId, productId } = useParams();
  const category = getCategory(categoryId);
  const product = getProduct(productId);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? "");
  const [expanded, setExpanded] = useState(false);

  const path = category && product ? `/collection/${category.id}/${product.id}/` : "/";
  const seo = useMemo(
    () =>
      product && category
        ? {
            title: `${product.name} · ${category.name} — Stellaris`,
            description: product.description ?? category.blurb,
            ogImage: product.image,
          }
        : undefined,
    [product, category],
  );

  useSeo(path, category?.id, seo);

  useEffect(() => {
    setSelectedSize(product?.sizes?.[0] ?? "");
    setExpanded(false);
  }, [product?.id, product?.sizes]);

  if (!category || !product || product.category !== category.id) {
    return <Navigate to="/" replace />;
  }

  const Icon = category.icon;
  const priceLabel =
    product.price !== undefined ? `${product.price.toFixed(2)} €` : "Precio a consultar";
  const related = getProductsByCategory(category.id)
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const purchaseSubject = `Solicitud de compra · ${product.name}${selectedSize ? ` · ${selectedSize}` : ""}`;
  const purchaseBody = [
    `Hola, me interesa este producto:`,
    ``,
    `Producto: ${product.name}`,
    `Referencia: ${product.id}`,
    selectedSize ? `Tamaño: ${selectedSize}` : "",
    `Enlace: ${typeof window !== "undefined" ? window.location.href : path}`,
    ``,
    `¿Podéis confirmarme medidas, precio y disponibilidad?`,
  ]
    .filter((line) => line !== "")
    .join("\n");
  const mailto = `mailto:hola@stellaris-shop.com?subject=${encodeURIComponent(purchaseSubject)}&body=${encodeURIComponent(purchaseBody)}`;

  return (
    <section className="min-h-[70vh] bg-[#fbf8f2] px-5 pb-20 pt-10 md:px-8 md:pt-14">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-[#927c66]">
          <Link to="/#collection" className="inline-flex items-center gap-2 hover:text-[#a16d4e]">
            <ArrowLeft size={14} /> Todas las colecciones
          </Link>
          <span className="text-[#c6b6a4]">/</span>
          <Link to={`/collection/${category.id}/`} className="hover:text-[#a16d4e]">
            {category.name}
          </Link>
          <span className="text-[#c6b6a4]">/</span>
          <span className="text-[#5d665c]">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_.98fr] lg:items-start">
          <div>
            <div className="group relative overflow-hidden rounded-3xl border border-[#e0d3c3] bg-[#eee5d9]">
              <img
                src={product.image}
                alt={product.name}
                className="mx-auto h-full max-h-[640px] w-full cursor-zoom-in object-contain"
                onClick={() => setExpanded(true)}
              />
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-[#d8c8b5] bg-[#fbf8f2]/95 px-3.5 py-2 text-[11px] text-[#5d665c] shadow-sm backdrop-blur transition hover:border-[#b59779] hover:text-[#8e6242]"
              >
                <Maximize2 size={14} /> Ampliar imagen
              </button>
            </div>
            {product.measurements && (
              <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#9a8977]">
                <Sparkles size={13} className="mt-0.5 shrink-0" /> {product.measurements}
              </p>
            )}
          </div>

          <div className="lg:pt-2">
            <span className="eyebrow"><Icon size={14} /> {category.eyebrow}</span>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-display text-4xl leading-tight text-[#2d403c] md:text-5xl">
                {product.name}
              </h1>
              <span className="rounded-full border border-[#ddcdb9] bg-[#f4ede3] px-3 py-1.5 text-[10px] uppercase tracking-[.14em] text-[#8b735b]">
                Pieza única
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-display text-3xl text-[#8d5f45]">{priceLabel}</span>
              <span className="text-[11px] text-[#9a8977]">Impuestos y envío a confirmar</span>
            </div>

            {product.description && (
              <p className="mt-5 text-sm leading-7 text-[#736659]">{product.description}</p>
            )}

            {product.details && (
              <ul className="mt-5 space-y-2.5">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2.5 text-sm leading-6 text-[#736659]">
                    <Check size={15} className="mt-1 shrink-0 text-[#a9794f]" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}

            {product.features && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.features.map((feature) => (
                  <li key={feature} className="rounded-full border border-[#e5dbcf] px-3 py-1.5 text-[10px] text-[#837564]">
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#8b735b]">
                  Tamaño
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const active = size === selectedSize;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-2 text-xs transition ${
                          active
                            ? "border-[#a9794f] bg-[#a9794f] text-[#fffaf3]"
                            : "border-[#d8c8b5] bg-transparent text-[#6e6254] hover:border-[#a9794f] hover:text-[#8e6242]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.note && (
              <p className="mt-6 text-xs leading-5 text-[#9a8977]">{product.note}</p>
            )}

            <div className="mt-7 rounded-3xl border border-[#e0d3c3] bg-[#f7f1e8] p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={mailto} className="button-primary flex-1">
                  <Mail size={15} /> Solicitar compra
                </a>
                <Link to={`/collection/${category.id}/`} className="button-secondary flex-1">
                  Seguir explorando <ArrowRight size={15} />
                </Link>
              </div>
              <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#9a8977]">
                <ShoppingBag size={13} className="mt-0.5 shrink-0" />
                El pago online estará disponible próximamente. De momento gestionamos cada pedido por email.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow"><Sparkles size={13} /> Más de esta colección</p>
                <h2 className="mt-2 font-display text-3xl text-[#2d403c]">También te puede gustar</h2>
              </div>
              <Link to={`/collection/${category.id}/`} className="text-xs text-[#927c66] hover:text-[#a16d4e]">
                Ver toda la colección
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ProductImageLightbox
        open={expanded}
        src={product.image}
        alt={product.name}
        onClose={() => setExpanded(false)}
      />
    </section>
  );
}
