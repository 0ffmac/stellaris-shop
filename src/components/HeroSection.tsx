import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StarViewer } from "@/components/StarViewer";
import { ChevronDown, Play, Pause, Lightbulb } from "lucide-react";

const DEFAULT_SKINS = [
  { id: "default", name: "Classic Lantern", url: "/assets/skins/skin.png" },
  { id: "skin1", name: "Crimson Ember", url: "/assets/skins/skin1.png" },
  { id: "skin2", name: "Deep Azure", url: "/assets/skins/skin2.png" },
  { id: "skin3", name: "Solar Gold", url: "/assets/skins/skin3.png" },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeSkinId, setActiveSkinId] = useState(DEFAULT_SKINS[0].id);
  const [paused, setPaused] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [brightness, setBrightness] = useState(0.6);

  useEffect(() => {
    const pickRandom = () => {
      const i = Math.floor(Math.random() * DEFAULT_SKINS.length);
      setActiveSkinId(DEFAULT_SKINS[i].id);
    };
    pickRandom();
    const interval = setInterval(pickRandom, 3500);
    return () => clearInterval(interval);
  }, []);

  const heroMaterial = {
    roughness: 0.35,
    metalness: 0.25,
    glow: lightOn ? brightness : 0,
    wireframe: false,
    lightOn,
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const activeScene = useMemo(
    () => ({
      id: "studio",
      name: "Studio",
      description: "Clean neutral studio lighting",
      backgroundColor: "#1c1c24",
      ambientIntensity: 0.5,
      ambientColor: "#ffffff",
      keyLightIntensity: 2.0,
      keyLightPosition: [-3, 5, 5] as [number, number, number],
      keyLightColor: "#ffffff",
      fillLightIntensity: 0.8,
      fillLightPosition: [4, 1, 3] as [number, number, number],
      fillLightColor: "#ffffff",
      cameraPosition: [-4, 0.4, 4.5] as [number, number, number],
      modelPosition: [0, 0, 0] as [number, number, number],
      fov: 16,
      autoRotate: !paused,
      autoRotateSpeed: 1.0,
    }),
    [paused],
  );
  const activeSkin = DEFAULT_SKINS.find((s) => s.id === activeSkinId) || DEFAULT_SKINS[0];

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-stone-950"
    >
      {/* Full-screen 3D background */}
      <motion.div style={{ scale: parallaxScale }} className="absolute inset-0">
        <StarViewer
          textureUrl={activeSkin.url}
          scenePreset={activeScene}
          material={heroMaterial}
          modelOffset={[0.6, 0, 0]}
        />
      </motion.div>

      {/* Gradient overlay for text readability on the left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/30 to-transparent pointer-events-none" />

      {/* ── Text Content (overlaid on scene) ───────────────────────────────── */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="flex absolute inset-0 z-10 flex-col sm:justify-center justify-start sm:pt-0 pt-14 px-8 md:px-16 lg:px-20 pointer-events-none"
      >
        <div className="max-w-xl pointer-events-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden sm:block text-xs uppercase tracking-[0.3em] text-amber-400/70 mb-4 font-sans"
          >
            Luxury Celestial Objects
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-stone-100 leading-tight"
          >
            Celestial
            <span className="block sm:text-3xl md:text-4xl lg:text-5xl text-xl font-light text-stone-400 sm:mt-2 mt-1">
              Crafted for the Cosmos
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="hidden sm:block mt-6 max-w-sm text-stone-400 text-sm font-light leading-relaxed font-sans"
          >
            An expression of quiet luxury. Each star is meticulously designed
            for those who command attention without seeking it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
            className="hidden sm:flex mt-8 flex-wrap gap-3"
          >
            <a
              href="#products"
              className="px-7 py-2.5 rounded-full bg-amber-700/20 border border-amber-700/50 text-amber-300 text-xs uppercase tracking-[0.15em] hover:bg-amber-700/30 hover:border-amber-600 transition-all duration-300"
            >
              Explore Collection
            </a>
            <a
              href="#about"
              className="px-7 py-2.5 rounded-full border border-stone-700/50 text-stone-400 text-xs uppercase tracking-[0.15em] hover:border-stone-600 hover:text-stone-300 transition-all duration-300"
            >
              Our Story
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom Controls Dock ───────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-stone-950/70 backdrop-blur-lg border-t border-stone-800/60">
        {/* Mobile: single row */}
        <div className="flex sm:hidden flex-col gap-1.5 px-3 py-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setPaused(!paused)}
              className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-800/60 hover:bg-stone-700 border border-stone-700/60 text-sm text-stone-300 transition cursor-pointer"
              title={paused ? "Resume rotation" : "Pause rotation"}
            >
              {paused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <div className="w-px h-5 bg-stone-800 shrink-0" />

            <button
              onClick={() => setLightOn(!lightOn)}
              className={`shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg border transition cursor-pointer ${
                lightOn
                  ? "bg-amber-900/30 text-amber-300 border-amber-700/40"
                  : "bg-stone-800/60 text-stone-500 hover:text-stone-300 border-stone-700/60 hover:bg-stone-700"
              }`}
              title="Toggle inner light"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${lightOn ? "text-amber-400" : ""}`} />
            </button>

            {lightOn && (
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.01"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                className="w-20 accent-amber-500 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer shrink-0"
              />
            )}

          </div>
        </div>

        {/* Desktop: single row */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-3 overflow-x-auto">
          {/* Play/Pause */}
          <button
            onClick={() => setPaused(!paused)}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700 border border-stone-700/60 text-xs text-stone-300 transition cursor-pointer"
            title={paused ? "Resume rotation" : "Pause rotation"}
          >
            {paused ? (
              <Play className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          <div className="w-px h-6 bg-stone-800 shrink-0" />

          {/* Inner Light */}
          <button
            onClick={() => setLightOn(!lightOn)}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
              lightOn
                ? "bg-amber-900/30 text-amber-300 border-amber-700/40"
                : "bg-stone-800/60 text-stone-500 hover:text-stone-300 border-stone-700/60 hover:bg-stone-700"
            }`}
            title="Toggle inner light"
          >
            <Lightbulb className={`w-3.5 h-3.5 ${lightOn ? "text-amber-400" : ""}`} />
            <span className="text-[10px] font-medium uppercase tracking-[0.1em]">Light</span>
          </button>

          {lightOn && (
            <input
              type="range"
              min="0"
              max="1.2"
              step="0.01"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
              className="w-16 accent-amber-500 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer shrink-0"
            />
          )}

          {/* Scene description (right side) */}
          <div className="shrink-0 ml-auto text-[10px] text-stone-600 font-sans">
            {activeScene.description}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
      >
        <ChevronDown className="w-5 h-5 text-stone-500" />
      </motion.div>
    </section>
  );
}
