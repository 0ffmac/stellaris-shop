import { useState, useRef, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StarViewer } from "@/components/StarViewer";
import { scenePresets } from "@/scenes/presets";
import type { SkinPreset } from "@/types/scene";
import { ChevronDown, Sun, Upload, Trash2, Play, Pause } from "lucide-react";

const heroMaterial = {
  roughness: 0.35,
  metalness: 0.25,
  glow: 0.08,
  wireframe: false,
};

const DEFAULT_SKINS: SkinPreset[] = [
  { id: "default", name: "Classic Lantern", url: "/assets/skins/skin.png" },
  { id: "skin1", name: "Crimson Ember", url: "/assets/skins/skin1.png" },
  { id: "skin2", name: "Deep Azure", url: "/assets/skins/skin2.png" },
  { id: "skin3", name: "Solar Gold", url: "/assets/skins/skin3.png" },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [sceneId, setSceneId] = useState(scenePresets[0].id);
  const [skins, setSkins] = useState<SkinPreset[]>(DEFAULT_SKINS);
  const [activeSkinId, setActiveSkinId] = useState(DEFAULT_SKINS[0].id);
  const [paused, setPaused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const rawScene =
    scenePresets.find((s) => s.id === sceneId) || scenePresets[0];
  const activeScene = useMemo(
    () => ({
      ...rawScene,
      cameraPosition: [-4, 0.4, 4.5] as [number, number, number],
      modelPosition: [1.0, 0, 0] as [number, number, number],
      fov: 16,
      autoRotate: paused ? false : rawScene.autoRotate,
    }),
    [rawScene, paused],
  );
  const activeSkin = skins.find((s) => s.id === activeSkinId) || skins[0];

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const newSkin: SkinPreset = {
      id: `custom-${Date.now()}`,
      name: file.name.split(".")[0].substring(0, 15) || "Custom",
      url: objectUrl,
      isCustom: true,
    };
    setSkins((prev) => [...prev, newSkin]);
    setActiveSkinId(newSkin.id);
    e.target.value = "";
  }, []);

  const handleDeleteSkin = useCallback(
    (sid: string) => {
      const skin = skins.find((s) => s.id === sid);
      if (skin?.isCustom) URL.revokeObjectURL(skin.url);
      const next = skins.filter((s) => s.id !== sid);
      setSkins(next);
      if (activeSkinId === sid)
        setActiveSkinId(next[0]?.id || DEFAULT_SKINS[0].id);
    },
    [skins, activeSkinId],
  );

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
        />
      </motion.div>

      {/* Gradient overlay for text readability on the left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/30 to-transparent pointer-events-none" />

      {/* ── Text Content (overlaid on scene) ───────────────────────────────── */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="hidden sm:flex absolute inset-0 z-10 flex-col justify-center px-8 md:px-16 lg:px-20 pointer-events-none"
      >
        <div className="max-w-xl pointer-events-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xs uppercase tracking-[0.3em] text-amber-400/70 mb-4 font-sans"
          >
            Luxury Celestial Objects
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-stone-100 leading-tight"
          >
            Celestial
            <span className="block text-3xl md:text-4xl lg:text-5xl font-light text-stone-400 mt-2">
              Crafted for the Cosmos
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-6 max-w-sm text-stone-400 text-sm font-light leading-relaxed font-sans"
          >
            An expression of quiet luxury. Each star is meticulously designed
            for those who command attention without seeking it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-3"
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
        {/* Mobile: two rows, skins first */}
        <div className="flex sm:hidden flex-col gap-1.5 px-3 py-2">
          {/* Row 1: Skins + Upload */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {skins.map((skin) => {
              const isActive = skin.id === activeSkinId;
              return (
                <button
                  key={skin.id}
                  onClick={() => setActiveSkinId(skin.id)}
                  className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    isActive
                      ? "border-amber-500 shadow-[0_0_10px_-2px_rgba(245,158,11,0.4)] scale-105"
                      : "border-stone-700/60 hover:border-stone-600 opacity-60 hover:opacity-100"
                  }`}
                  title={skin.name}
                >
                  <img
                    src={skin.url}
                    alt={skin.name}
                    className="w-14 h-10 object-cover bg-stone-800"
                  />
                  {skin.isCustom && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteSkin(skin.id); }}
                      className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/60 text-stone-300 hover:text-red-400 transition opacity-0 hover:opacity-100"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </button>
              );
            })}
            <label className="shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-lg bg-stone-800/60 hover:bg-amber-800/50 border border-stone-700/60 hover:border-amber-700/50 text-xs font-medium text-stone-400 hover:text-amber-300 transition cursor-pointer">
              <Upload className="w-3 h-3" />
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>

          {/* Row 2: Play/Pause + Scene Selector */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setPaused(!paused)}
              className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-800/60 hover:bg-stone-700 border border-stone-700/60 text-sm text-stone-300 transition cursor-pointer"
              title={paused ? "Resume rotation" : "Pause rotation"}
            >
              {paused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            </button>
            <div className="w-px h-5 bg-stone-800 shrink-0" />
            <div className="flex items-center gap-1.5 shrink-0">
              <Sun className="w-3.5 h-3.5 text-amber-400/70" />
              {scenePresets.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => setSceneId(scene.id)}
                  className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.1em] font-sans font-medium transition-all duration-300 cursor-pointer ${
                    sceneId === scene.id
                      ? "bg-amber-800/30 text-amber-300 border border-amber-700/40"
                      : "text-stone-500 hover:text-stone-300 border border-transparent"
                  }`}
                >
                  {scene.name}
                </button>
              ))}
            </div>
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

          {/* Scene Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Sun className="w-3.5 h-3.5 text-amber-400/70" />
            {scenePresets.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setSceneId(scene.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.1em] font-sans font-medium transition-all duration-300 cursor-pointer ${
                  sceneId === scene.id
                    ? "bg-amber-800/30 text-amber-300 border border-amber-700/40"
                    : "text-stone-500 hover:text-stone-300 border border-transparent"
                }`}
              >
                {scene.name}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-stone-800 shrink-0" />

          {/* Skin Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {skins.map((skin) => {
              const isActive = skin.id === activeSkinId;
              return (
                <button
                  key={skin.id}
                  onClick={() => setActiveSkinId(skin.id)}
                  className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    isActive
                      ? "border-amber-500 shadow-[0_0_10px_-2px_rgba(245,158,11,0.4)] scale-105"
                      : "border-stone-700/60 hover:border-stone-600 opacity-60 hover:opacity-100"
                  }`}
                  title={skin.name}
                >
                  <img
                    src={skin.url}
                    alt={skin.name}
                    className="w-12 h-8 object-cover bg-stone-800"
                  />
                  {skin.isCustom && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteSkin(skin.id); }}
                      className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/60 text-stone-300 hover:text-red-400 transition opacity-0 hover:opacity-100"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </button>
              );
            })}
          </div>

          {/* Upload */}
          <label className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800/60 hover:bg-amber-800/50 border border-stone-700/60 hover:border-amber-700/50 text-[10px] font-medium text-stone-400 hover:text-amber-300 transition cursor-pointer">
            <Upload className="w-3 h-3" />
            <span className="hidden sm:inline">Upload</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

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
