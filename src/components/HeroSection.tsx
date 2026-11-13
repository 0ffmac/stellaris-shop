import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { StarViewer } from "@/components/StarViewer";

const SKINS = [
  { id: "skin", name: "Natural", url: "/assets/skins/skin.png" },
  { id: "skin1", name: "Cálido", url: "/assets/skins/skin1.png" },
  { id: "skin2", name: "Azul", url: "/assets/skins/skin2.png" },
  { id: "skin3", name: "Dorado", url: "/assets/skins/skin3.png" },
];

export function HeroSection() {
  const [activeSkin, setActiveSkin] = useState(SKINS[0]);
  const scene = useMemo(() => ({
    id: "stellaris-studio",
    name: "Stellaris Studio",
    description: "Luz cálida y fondo neutro",
    backgroundColor: "#eee4d7",
    ambientIntensity: 0.75,
    ambientColor: "#fff7eb",
    keyLightIntensity: 2.1,
    keyLightPosition: [-3, 5, 5] as [number, number, number],
    keyLightColor: "#fff1db",
    fillLightIntensity: 0.9,
    fillLightPosition: [4, 1, 3] as [number, number, number],
    fillLightColor: "#e8c9a7",
    cameraPosition: [-3.4, 0.4, 4.8] as [number, number, number],
    modelPosition: [0, 0, 0] as [number, number, number],
    fov: 19,
    autoRotate: true,
    autoRotateSpeed: 0.65,
  }), []);

  const material = { roughness: 0.52, metalness: 0.08, glow: 0.12, wireframe: false, lightOn: false };

  return (
    <section id="hero" className="hero-shell">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-12 lg:py-20">
        <div className="relative z-10 order-2 lg:order-1">
          <p className="eyebrow mb-5"><Sparkles size={14}/> Objetos con alma, detalles con historia</p>
          <h1 className="max-w-2xl font-display text-5xl leading-[.98] tracking-tight text-[#263d3a] sm:text-6xl lg:text-[5.2rem]">
            Un universo de <em className="text-[#a66e51]">pequeños</em> tesoros.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#706356] md:text-lg">
            Estrellas de papel, lámparas artesanales, gemas y objetos para llenar tus espacios de luz, color y personalidad.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/#collection" className="button-primary">Descubrir colecciones <ArrowRight size={16}/></Link>
            <Link to="/#about" className="button-secondary">Conoce Stellaris</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#d9cbbb] pt-5 text-xs tracking-wide text-[#81715f]">
            <span>✳ Selección cuidada</span><span>✳ Detalles especiales</span><span>✳ Envíos desde España*</span>
          </div>
          <p className="mt-2 text-[10px] text-[#9b8b7a]">*Condiciones y destinos por confirmar antes del lanzamiento.</p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#e9ddcd] shadow-[0_25px_70px_rgba(74,54,36,.14)]">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-white/70 bg-[#fbf8f2]/80 px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-[#6e6659] backdrop-blur">El diseño original Stellaris</div>
            <div className="h-[310px] sm:h-[420px] lg:h-[480px]">
              <StarViewer textureUrl={activeSkin.url} scenePreset={scene} material={material} modelOffset={[0, 0, 0]}/>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-2xl border border-white/70 bg-[#fbf8f2]/90 p-3 backdrop-blur">
              <div>
                <p className="text-[10px] uppercase tracking-[.18em] text-[#8b7864]">Explora los acabados</p>
                <p className="mt-1 text-sm font-medium text-[#344541]">{activeSkin.name}</p>
              </div>
              <div className="flex gap-2">
                {SKINS.map((skin) => (
                  <button key={skin.id} onClick={() => setActiveSkin(skin)} aria-label={`Ver acabado ${skin.name}`} title={skin.name} className={`h-8 w-8 rounded-full border-2 transition ${activeSkin.id === skin.id ? "border-[#a36d4d] ring-2 ring-[#a36d4d]/20" : "border-white"}`}>
                    <img src={skin.url} alt="" className="h-full w-full rounded-full object-cover"/>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-[#968574]">Vista 3D interactiva · Arrastra para girar</p>
        </div>
      </div>
      <a href="#collection" className="mx-auto mb-4 flex w-fit items-center gap-2 text-[10px] uppercase tracking-[.2em] text-[#8c7864]">Explora el universo <ArrowDown size={13}/></a>
    </section>
  );
}
