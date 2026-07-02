export interface MaterialSettings {
  roughness: number;
  metalness: number;
  glow: number;
  wireframe: boolean;
}

export interface ScenePreset {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  ambientIntensity: number;
  ambientColor: string;
  keyLightIntensity: number;
  keyLightPosition: [number, number, number];
  keyLightColor: string;
  fillLightIntensity: number;
  fillLightPosition: [number, number, number];
  fillLightColor: string;
  cameraPosition: [number, number, number];
  modelPosition?: [number, number, number];
  fov?: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

export interface SkinPreset {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

export interface StarViewerProps {
  textureUrl: string;
  scenePreset: ScenePreset;
  material: MaterialSettings;
  className?: string;
}
