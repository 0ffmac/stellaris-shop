import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { ScenePreset, MaterialSettings } from "@/types/scene";

interface UseStarViewerOptions {
  textureUrl: string;
  scenePreset: ScenePreset;
  material: MaterialSettings;
  modelOffset?: [number, number, number];
}

interface UseStarViewerReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  progress: number;
  error: string | null;
}

export function useStarViewer({
  textureUrl,
  scenePreset,
  material: materialSettings,
  modelOffset,
}: UseStarViewerOptions): UseStarViewerReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Three.js object refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const textureLoaderRef = useRef(new THREE.TextureLoader());
  const lightOnRef = useRef(false);

  // Refs for animation loop to avoid stale closures on preset changes
  const autoRotateRef = useRef(scenePreset.autoRotate);
  const rotateSpeedRef = useRef(scenePreset.autoRotateSpeed);

  // ── Initialize scene (runs once) ──────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(scenePreset.backgroundColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(scenePreset.fov ?? 40, W / H, 0.1, 100);
    camera.position.set(...scenePreset.cameraPosition);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(...(scenePreset.modelPosition ?? [0, 0, 0]));
    controlsRef.current = controls;

    // Lights
    const ambient = new THREE.AmbientLight(
      new THREE.Color(scenePreset.ambientColor),
      scenePreset.ambientIntensity
    );
    scene.add(ambient);
    ambientLightRef.current = ambient;

    const key = new THREE.DirectionalLight(
      new THREE.Color(scenePreset.keyLightColor),
      scenePreset.keyLightIntensity
    );
    key.position.set(...scenePreset.keyLightPosition);
    scene.add(key);
    keyLightRef.current = key;

    const fill = new THREE.DirectionalLight(
      new THREE.Color(scenePreset.fillLightColor),
      scenePreset.fillLightIntensity
    );
    fill.position.set(...scenePreset.fillLightPosition);
    scene.add(fill);
    fillLightRef.current = fill;

    // Model group
    const group = new THREE.Group();
    const base = scenePreset.modelPosition ?? [0, 0, 0] as [number, number, number];
    const off = modelOffset ?? [0, 0, 0];
    group.position.set(base[0] + off[0], base[1] + off[1], base[2] + off[2]);
    scene.add(group);
    modelGroupRef.current = group;

    // Material
    const mat = new THREE.MeshStandardMaterial({
      roughness: materialSettings.roughness,
      metalness: materialSettings.metalness,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: materialSettings.glow,
      wireframe: materialSettings.wireframe,
      transparent: true,
      opacity: 1.0,
    });
    materialRef.current = mat;

    // ── Load model ──────────────────────────────────────────────────────────
    setLoading(true);
    const gltfLoader = new GLTFLoader();

    const loadModel = () => {
      gltfLoader.load(
        "/assets/models/Star.glb",
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const geom = child.geometry;
              if (geom.attributes.uv) {
                const uvAttr = geom.attributes.uv;
                const uvArr = uvAttr.array;
                let uMin = Infinity, uMax = -Infinity, vMin = Infinity, vMax = -Infinity;
                for (let i = 0; i < uvArr.length; i += 2) {
                  uMin = Math.min(uMin, uvArr[i]);
                  uMax = Math.max(uMax, uvArr[i]);
                  vMin = Math.min(vMin, uvArr[i + 1]);
                  vMax = Math.max(vMax, uvArr[i + 1]);
                }
                if (uMin === uMax && vMin === vMax) {
                  const posAttr = geom.attributes.position;
                  let pxMin = Infinity, pxMax = -Infinity, pzMin = Infinity, pzMax = -Infinity;
                  for (let i = 0; i < posAttr.count; i++) {
                    const x = posAttr.getX(i);
                    const z = posAttr.getZ(i);
                    pxMin = Math.min(pxMin, x);
                    pxMax = Math.max(pxMax, x);
                    pzMin = Math.min(pzMin, z);
                    pzMax = Math.max(pzMax, z);
                  }
                  const uRange = pxMax - pxMin || 1;
                  const vRange = pzMax - pzMin || 1;
                  for (let i = 0; i < uvArr.length; i += 2) {
                    uvArr[i] = (posAttr.getX(i / 2) - pxMin) / uRange;
                    uvArr[i + 1] = (posAttr.getZ(i / 2) - pzMin) / vRange;
                  }
                  uvAttr.needsUpdate = true;
                }
              }
              child.material = mat;
            }
          });
          model.rotation.x = -Math.PI / 2;
          group.add(model);
          setLoading(false);
        },
        (xhr) => setProgress(Math.round((xhr.loaded / xhr.total) * 100)),
        (err) => {
          console.error("Failed to load model:", err);
          setError("Failed to load model");
          setLoading(false);
        }
      );
    };

    // ── Load texture, then model ─────────────────────────────────────────────
    textureLoaderRef.current.load(
      textureUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        mat.map = texture;
        mat.needsUpdate = true;
        loadModel();
      },
      undefined,
      (err) => {
        console.error("Failed to load texture:", err);
        setError("Failed to load texture");
        setLoading(false);
      }
    );

    // ── Animation loop ─────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (autoRotateRef.current && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += clock.getDelta() * 0.15 * rotateSpeedRef.current;
      } else {
        clock.getDelta();
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ──────────────────────────────────────────────────────
    const handleResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
      mat.dispose();
      mat.map?.dispose();
    };
  }, []);

  // ── Update scene preset ───────────────────────────────────────────────────
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.background = new THREE.Color(scenePreset.backgroundColor);
    if (cameraRef.current) {
      cameraRef.current.position.set(...scenePreset.cameraPosition);
      if (scenePreset.fov && Math.abs(cameraRef.current.fov - scenePreset.fov) > 0.1) {
        cameraRef.current.fov = scenePreset.fov;
        cameraRef.current.updateProjectionMatrix();
      }
    }
    if (controlsRef.current && scenePreset.modelPosition) {
      controlsRef.current.target.set(...scenePreset.modelPosition);
    }
    if (modelGroupRef.current) {
      const base = scenePreset.modelPosition ?? [0, 0, 0] as [number, number, number];
      const off = modelOffset ?? [0, 0, 0];
      modelGroupRef.current.position.set(base[0] + off[0], base[1] + off[1], base[2] + off[2]);
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.color.set(scenePreset.ambientColor);
      ambientLightRef.current.intensity = scenePreset.ambientIntensity;
    }
    if (keyLightRef.current) {
      keyLightRef.current.color.set(scenePreset.keyLightColor);
      keyLightRef.current.intensity = scenePreset.keyLightIntensity;
      keyLightRef.current.position.set(...scenePreset.keyLightPosition);
    }
    if (fillLightRef.current) {
      fillLightRef.current.color.set(scenePreset.fillLightColor);
      fillLightRef.current.intensity = scenePreset.fillLightIntensity;
      fillLightRef.current.position.set(...scenePreset.fillLightPosition);
    }
    autoRotateRef.current = scenePreset.autoRotate;
    rotateSpeedRef.current = scenePreset.autoRotateSpeed;
  }, [scenePreset]);

  // ── Update material ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!materialRef.current) return;
    const mat = materialRef.current;
    mat.roughness = materialSettings.roughness;
    mat.metalness = materialSettings.metalness;
    mat.wireframe = materialSettings.wireframe;
    lightOnRef.current = materialSettings.lightOn;

    if (materialSettings.lightOn && mat.map) {
      mat.emissive = new THREE.Color("#ff8844");
      mat.emissiveMap = mat.map;
      mat.emissiveIntensity = materialSettings.glow;
    } else {
      mat.emissive = new THREE.Color(0x000000);
      mat.emissiveMap = null;
      mat.emissiveIntensity = 0;
    }
    mat.needsUpdate = true;
  }, [materialSettings]);

  // ── Update texture ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!materialRef.current) return;
    textureLoaderRef.current.load(
      textureUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        materialRef.current?.map?.dispose();
        if (materialRef.current) {
          const mat = materialRef.current;
          mat.map = texture;
          if (lightOnRef.current) {
            mat.emissiveMap = texture;
          }
          mat.needsUpdate = true;
        }
      }
    );
  }, [textureUrl]);

  return { containerRef, loading, progress, error };
}
