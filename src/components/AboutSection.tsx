import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Shield, Gem } from "lucide-react";

const values = [
  {
    icon: Star,
    title: "Artisanal Craft",
    description:
      "Each star is designed with meticulous attention to light, form, and material. A fusion of traditional artistry and modern precision.",
  },
  {
    icon: Gem,
    title: "Premium Materials",
    description:
      "We source the finest optical-grade materials to ensure each piece radiates with unparalleled clarity and depth.",
  },
  {
    icon: Shield,
    title: "Lifetime Guarantee",
    description:
      "Every celestial object is backed by our lifetime guarantee. Crafted to endure, designed to inspire.",
  },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <section id="about" ref={ref} className="relative bg-stone-950 py-28 px-6 border-t border-stone-900/60">
      <div className="max-w-7xl mx-auto">
        <motion.div style={{ opacity, y }} className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400/60 mb-4 font-sans">
            About Stellaris
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-stone-100 mb-6">
            Defining Luxury Through Light
          </h2>
          <p className="text-stone-400 text-sm font-light leading-relaxed">
            Stellaris is designed for those who command attention without seeking it.
            A reflection of nature&apos;s raw beauty, reimagined through the lens of
            modern design. Each piece tells a story of quiet confidence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {values.map((item, i) => (
            <ValueCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  item,
  index,
}: {
  item: (typeof values)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-stone-900/80 border border-stone-800/60 group-hover:border-amber-800/40 transition-colors duration-500 mb-6">
        <item.icon className="w-6 h-6 text-amber-500/60 group-hover:text-amber-400 transition-colors duration-500" />
      </div>
      <h3 className="font-display text-xl text-stone-200 mb-3">{item.title}</h3>
      <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs mx-auto">
        {item.description}
      </p>
    </motion.div>
  );
}
