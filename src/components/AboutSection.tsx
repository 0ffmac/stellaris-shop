import { Heart, Leaf, Sparkles } from "lucide-react";

const values = [
  { icon: Heart, title: "Piezas con personalidad", text: "Una selección de objetos especiales, elegidos por sus materiales, colores y carácter." },
  { icon: Leaf, title: "Belleza para tus espacios", text: "Texturas, luz y pequeños detalles que ayudan a crear rincones que se sienten tuyos." },
  { icon: Sparkles, title: "El placer de regalar", text: "Ideas para sorprender con algo diferente, bonito y lleno de intención." },
];

export function AboutSection() {
  return (
    <section id="about" className="section-pad bg-[#294541] text-[#f8f2e9]">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-[10px] uppercase tracking-[.25em] text-[#d6b58b]">La filosofía Stellaris</p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">Objetos que hacen <em>hogar.</em></h2>
          <p className="mt-4 text-sm leading-7 text-[#d6d1c6]">Nos inspira la belleza de los pequeños detalles: una luz cálida, una textura especial, una piedra con carácter o un objeto que te recuerda a alguien.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-t border-white/20 pt-6 text-center">
              <Icon className="mx-auto mb-4 text-[#d6b58b]" size={25} strokeWidth={1.3}/>
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#d6d1c6]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
