import { useStarViewer } from "@/hooks/useStarViewer";
import type { StarViewerProps } from "@/types/scene";

export function StarViewer({ textureUrl, scenePreset, material, className = "", modelOffset }: StarViewerProps) {
  const { containerRef, loading, progress, error } = useStarViewer({
    textureUrl,
    scenePreset,
    material,
    modelOffset,
  });

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full" style={{ outline: "none" }} />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85 backdrop-blur-md z-20">
          <p className="text-indigo-400 font-semibold">{progress}% Loading...</p>
        </div>
      )}

      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85 backdrop-blur-md z-20">
          <div className="text-center max-w-md px-6">
            <p className="text-red-400 font-semibold text-lg mb-2">Error</p>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
