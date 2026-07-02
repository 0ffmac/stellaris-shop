import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { StarViewer } from "@/components/StarViewer";
import type { MaterialSettings } from "@/types/scene";

const products = [
  {
    id: "classic",
    name: "Classic Lantern",
    tagline: "Timeless radiance",
    description: "A warm, inviting glow that evokes the comfort of heritage craftsmanship.",
    price: "$180",
    skin: "/assets/skins/skin.png",
    features: ["Warm Amber", "Matte Finish", "Hand-polished"],
  },
  {
    id: "crimson",
    name: "Crimson Ember",
    tagline: "Bold intensity",
    description: "Forged in fire, this star commands attention with its deep, smoldering hue.",
    price: "$210",
    skin: "/assets/skins/skin1.png",
    features: ["Deep Crimson", "Satin Glow", "Limited Edition"],
  },
  {
    id: "azure",
    name: "Deep Azure",
    tagline: "Oceanic calm",
    description: "Cool and serene as the midnight sea. A statement of quiet confidence.",
    price: "$195",
    skin: "/assets/skins/skin2.png",
    features: ["Ocean Blue", "Iridescent", "UV Reactive"],
  },
];

const materialPresets = [
  { roughness: 0.35, metalness: 0.25, glow: 0.08, wireframe: false, lightOn: false },
  { roughness: 0.40, metalness: 0.30, glow: 0.12, wireframe: false, lightOn: false },
  { roughness: 0.30, metalness: 0.20, glow: 0.05, wireframe: false, lightOn: false },
];

export function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section id="products" ref={ref} className="relative min-h-screen bg-stone-950 py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400/60 mb-4 font-sans">
            The Collection
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-stone-100">
            An Essence for Every Space
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-stone-500 text-sm font-light leading-relaxed">
            Each celestial object is a unique expression of light and form.
            Choose the one that resonates with your world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} material={materialPresets[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
  material,
}: {
  product: (typeof products)[0];
  index: number;
  material: MaterialSettings;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="group rounded-2xl overflow-hidden bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm hover:border-amber-800/40 transition-all duration-500"
    >
      {/* 3D Viewer */}
      <div className="relative h-72 w-full bg-stone-950/60 overflow-hidden">
        <StarViewerCard skin={product.skin} material={material} />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-stone-950/60 backdrop-blur border border-stone-800/60 text-[10px] font-sans text-amber-400/80">
          {product.price}
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display text-xl text-stone-100">{product.name}</h3>
            <p className="text-xs text-amber-400/60 uppercase tracking-[0.15em] font-sans mt-0.5">
              {product.tagline}
            </p>
          </div>
          <Sparkles className="w-4 h-4 text-amber-500/40 group-hover:text-amber-400 transition-colors duration-300" />
        </div>
        <p className="text-sm text-stone-400 font-light leading-relaxed mb-4">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {product.features.map((f) => (
            <span
              key={f}
              className="px-2.5 py-1 rounded-full bg-stone-800/60 text-[10px] text-stone-400 font-sans uppercase tracking-[0.1em]"
            >
              {f}
            </span>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800/20 border border-amber-700/30 text-amber-300 text-xs uppercase tracking-[0.15em] hover:bg-amber-800/30 hover:border-amber-600/50 transition-all duration-300 cursor-pointer">
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Bag
        </button>
      </div>
    </motion.div>
  );
}

function StarViewerCard({
  skin,
  material,
}: {
  skin: string;
  material: MaterialSettings;
}) {
  const scene = {
    id: "product",
    name: "Product",
    description: "",
    backgroundColor: "#0c0a09",
    ambientIntensity: 0.4,
    ambientColor: "#ffffff",
    keyLightIntensity: 2.0,
    keyLightPosition: [-3, 5, 5] as [number, number, number],
    keyLightColor: "#ffffff",
    fillLightIntensity: 0.6,
    fillLightPosition: [4, 1, 3] as [number, number, number],
    fillLightColor: "#ffffff",
    cameraPosition: [0, 0.4, 4.5] as [number, number, number],
    autoRotate: true,
    autoRotateSpeed: 0.8,
  };

  return (
    <StarViewer
      textureUrl={skin}
      scenePreset={scene}
      material={material}
    />
  );
}
