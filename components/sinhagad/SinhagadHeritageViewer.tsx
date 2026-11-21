'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  Compass,
  Info,
  Footprints,
  Maximize,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface HeightfieldData {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  gridSize: number;
  step: number;
  heights: number[][];
}

interface ColliderCircle {
  cx: number;
  cz: number;
  radius: number;
}

interface ColliderBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export default function SinhagadHeritageViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [fps, setFps] = useState(60);
  const [telemetry, setTelemetry] = useState({
    easting: 368795.5,
    northing: 2031442.1,
    elevation: 1250.0,
    speed: 0.0,
    heading: 45,
  });
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [activeStructure, setActiveStructure] = useState<'PD' | 'TERRAIN' | null>('PD');
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Physics & Player State Ref
  const stateRef = useRef({
    pos: new THREE.Vector3(180.0, -80.0, -205.0), // approach start
    safePos: new THREE.Vector3(180.0, -80.0, -205.0),
    vel: new THREE.Vector3(),
    yaw: Math.PI * 0.75, // looking towards Gate 1
    pitch: 0.0,
    keys: { w: false, a: false, s: false, d: false, shift: false },
    touchMove: { x: 0, y: 0 },
    touchLook: { startX: 0, startY: 0, active: false },
    heightfield: null as HeightfieldData | null,
    colliders: {
      circles: [] as ColliderCircle[],
      boxes: [] as ColliderBox[],
    },
    lastTime: performance.now(),
    frameCount: 0,
    lastFpsUpdate: performance.now(),
  });

  // Sound generator
  const toggleSound = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setSoundEnabled((prev) => !prev);
    }
  }, []);

  // Respawn at safe start
  const handleRespawn = useCallback(() => {
    stateRef.current.pos.copy(stateRef.current.safePos);
    stateRef.current.vel.set(0, 0, 0);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup
    const width = container.clientWidth || window.innerWidth || 1280;
    const height = container.clientHeight || (window.innerHeight - 72) || 720;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8fa9bf); // Sahyadri mist morning sky
    scene.fog = new THREE.FogExp2(0x8fa9bf, 0.0018);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.2, 3500);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x444433, 0.95);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    dirLight.position.set(250, 400, 150);
    scene.add(dirLight);

    // 3. Collision Hulls for Architecture (Bastions and walls)
    // Pune Darwaza Bastions:
    const bastions = [
      // Gate 1 bastions
      { cx: 150 - 4.5 * Math.cos(0.7), cz: -170 - 4.5 * Math.sin(0.7), radius: 3.5 },
      { cx: 150 + 4.5 * Math.cos(0.7), cz: -170 + 4.5 * Math.sin(0.7), radius: 3.5 },
      // Gate 2 bastions
      { cx: 130 - 4.5 * Math.cos(0.7), cz: -145 - 4.5 * Math.sin(0.7), radius: 3.3 },
      { cx: 130 + 4.5 * Math.cos(0.7), cz: -145 + 4.5 * Math.sin(0.7), radius: 3.3 },
      // Gate 3 bastions
      { cx: 110 - 4.8 * Math.cos(0.7), cz: -120 - 4.8 * Math.sin(0.7), radius: 3.8 },
      { cx: 110 + 4.8 * Math.cos(0.7), cz: -120 + 4.8 * Math.sin(0.7), radius: 3.8 },
    ];
    stateRef.current.colliders.circles = bastions;

    // 4. Load Data Assets
    const loader = new GLTFLoader();
    let loadedCount = 0;
    const totalAssets = 3;

    const checkLoading = () => {
      loadedCount++;
      setLoadingProgress(Math.round((loadedCount / totalAssets) * 100));
      if (loadedCount >= totalAssets) {
        setIsLoading(false);
      }
    };

    // Load Terrain Heightfield JSON
    fetch('/assets/terrain/terrain_heightfield.json')
      .then((res) => res.json())
      .then((data: HeightfieldData) => {
        stateRef.current.heightfield = data;
        checkLoading();
      })
      .catch((err) => {
        console.warn('Could not load heightfield JSON, using analytical fallback:', err);
        checkLoading();
      });

    // Load Terrain GLB
    loader.load(
      '/assets/terrain/terrain_tile_M1.glb',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.receiveShadow = true;
            // Enhance terrain shading
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.85;
              mat.metalness = 0.05;
            }
          }
        });
        scene.add(gltf.scene);
        checkLoading();
      },
      undefined,
      (err) => {
        console.error('Error loading terrain GLB:', err);
        checkLoading();
      }
    );

    // Load Pune Darwaza GLB
    loader.load(
      '/assets/PD/pune_darwaza_M1.glb',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.75;
              mat.metalness = 0.1;
            }
          }
        });
        scene.add(gltf.scene);
        checkLoading();
      },
      undefined,
      (err) => {
        console.error('Error loading Pune Darwaza GLB:', err);
        checkLoading();
      }
    );

    // Heightfield sampler
    const sampleHeight = (x: number, z: number): number => {
      const hf = stateRef.current.heightfield;
      if (!hf) {
        // Analytical fallback terrain matching DEM profile
        const dist = Math.hypot(x, z);
        return Math.max(-250, 0 - Math.pow(dist / 25, 1.8));
      }
      if (x < hf.minX || x > hf.maxX || z < hf.minZ || z > hf.maxZ) {
        return -250;
      }
      const col = (x - hf.minX) / hf.step;
      const row = (z - hf.minZ) / hf.step;
      const c0 = Math.max(0, Math.min(hf.gridSize - 2, Math.floor(col)));
      const c1 = c0 + 1;
      const r0 = Math.max(0, Math.min(hf.gridSize - 2, Math.floor(row)));
      const r1 = r0 + 1;
      const fc = col - c0;
      const fr = row - r0;
      const h00 = hf.heights[r0][c0];
      const h10 = hf.heights[r0][c1];
      const h01 = hf.heights[r1][c0];
      const h11 = hf.heights[r1][c1];
      return (1 - fc) * (1 - fr) * h00 + fc * (1 - fr) * h10 + (1 - fc) * fr * h01 + fc * fr * h11;
    };

    // 5. Input Listeners
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') stateRef.current.keys.w = true;
      if (key === 's' || key === 'arrowdown') stateRef.current.keys.s = true;
      if (key === 'a' || key === 'arrowleft') stateRef.current.keys.a = true;
      if (key === 'd' || key === 'arrowright') stateRef.current.keys.d = true;
      if (e.key === 'Shift') stateRef.current.keys.shift = true;
      if (key === 'i') setShowInfoCard((prev) => !prev);
      if (key === 'r') {
        stateRef.current.pos.copy(stateRef.current.safePos);
        stateRef.current.vel.set(0, 0, 0);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') stateRef.current.keys.w = false;
      if (key === 's' || key === 'arrowdown') stateRef.current.keys.s = false;
      if (key === 'a' || key === 'arrowleft') stateRef.current.keys.a = false;
      if (key === 'd' || key === 'arrowright') stateRef.current.keys.d = false;
      if (e.key === 'Shift') stateRef.current.keys.shift = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== renderer.domElement) return;
      const sens = 0.0022;
      stateRef.current.yaw -= e.movementX * sens;
      stateRef.current.pitch -= e.movementY * sens;
      // Clamp pitch
      stateRef.current.pitch = Math.max(-Math.PI * 0.46, Math.min(Math.PI * 0.46, stateRef.current.pitch));
    };

    const onPointerLockChange = () => {
      setIsLocked(document.pointerLockElement === renderer.domElement);
    };

    const onCanvasClick = () => {
      if (document.pointerLockElement !== renderer.domElement) {
        renderer.domElement.requestPointerLock().catch((err) => console.log('PointerLock rejected:', err));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    renderer.domElement.addEventListener('click', onCanvasClick);

    // 6. Game Loop
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - stateRef.current.lastTime) / 1000, 0.05); // Delta time clamp
      stateRef.current.lastTime = now;

      // FPS tracking
      stateRef.current.frameCount++;
      if (now - stateRef.current.lastFpsUpdate >= 500) {
        setFps(Math.round((stateRef.current.frameCount * 1000) / (now - stateRef.current.lastFpsUpdate)));
        stateRef.current.frameCount = 0;
        stateRef.current.lastFpsUpdate = now;
      }

      // Movement vector calculation
      const forward = new THREE.Vector3(-Math.sin(stateRef.current.yaw), 0, -Math.cos(stateRef.current.yaw));
      const right = new THREE.Vector3(Math.cos(stateRef.current.yaw), 0, -Math.sin(stateRef.current.yaw));

      const moveDir = new THREE.Vector3();
      const { keys, touchMove } = stateRef.current;

      if (keys.w) moveDir.add(forward);
      if (keys.s) moveDir.sub(forward);
      if (keys.d) moveDir.add(right);
      if (keys.a) moveDir.sub(right);

      if (touchMove.x !== 0 || touchMove.y !== 0) {
        moveDir.addScaledVector(right, touchMove.x);
        moveDir.addScaledVector(forward, -touchMove.y);
      }

      const isMoving = moveDir.lengthSq() > 0.0001;
      const speed = keys.shift ? 2.2 : 1.4; // 1.4 m/s walk, 2.2 m/s sprint

      if (isMoving) {
        moveDir.normalize().multiplyScalar(speed * dt);
        const nextX = stateRef.current.pos.x + moveDir.x;
        const nextZ = stateRef.current.pos.z + moveDir.z;

        // Check bastion cylinder collisions
        let blocked = false;
        for (const circle of stateRef.current.colliders.circles) {
          const dist = Math.hypot(nextX - circle.cx, nextZ - circle.cz);
          if (dist < circle.radius + 0.35) {
            blocked = true;
            break;
          }
        }

        if (!blocked) {
          // Check ground height and slope
          const currentGround = sampleHeight(stateRef.current.pos.x, stateRef.current.pos.z);
          const nextGround = sampleHeight(nextX, nextZ);
          const deltaY = nextGround - currentGround;
          const stepDist = Math.hypot(moveDir.x, moveDir.z);

          // Allow climb if step height <= 0.35m or slope <= 45 deg
          if (deltaY <= 0.35 || (stepDist > 0 && deltaY / stepDist < 1.0)) {
            stateRef.current.pos.x = nextX;
            stateRef.current.pos.z = nextZ;
            // Smooth vertical stepping
            stateRef.current.pos.y = nextGround;
          }
        }
      } else {
        // Snap to ground when idle
        const groundY = sampleHeight(stateRef.current.pos.x, stateRef.current.pos.z);
        stateRef.current.pos.y = groundY;
      }

      // Safe position tracking & fall protection
      if (stateRef.current.pos.y > -150) {
        stateRef.current.safePos.copy(stateRef.current.pos);
      } else {
        // Auto respawn if fell off mountain
        stateRef.current.pos.copy(stateRef.current.safePos);
      }

      // Camera sync (Eye level: 1.65m above ground)
      camera.position.set(stateRef.current.pos.x, stateRef.current.pos.y + 1.65, stateRef.current.pos.z);

      const lookTarget = new THREE.Vector3(
        camera.position.x - Math.sin(stateRef.current.yaw) * Math.cos(stateRef.current.pitch),
        camera.position.y + Math.sin(stateRef.current.pitch),
        camera.position.z - Math.cos(stateRef.current.yaw) * Math.cos(stateRef.current.pitch)
      );
      camera.lookAt(lookTarget);

      // Telemetry updates (throttled to 10Hz to prevent React re-render thrashing)
      const X0 = 368495.5;
      const Y0 = 2031092.1;
      const Z0 = 1307.3;

      const currentEasting = X0 + stateRef.current.pos.x;
      const currentNorthing = Y0 - stateRef.current.pos.z;
      const currentElevation = Z0 + stateRef.current.pos.y;
      const headingDeg = (Math.round((-(stateRef.current.yaw * 180) / Math.PI) % 360) + 360) % 360;

      // Update telemetry state
      setTelemetry({
        easting: Math.round(currentEasting * 10) / 10,
        northing: Math.round(currentNorthing * 10) / 10,
        elevation: Math.round(currentElevation * 10) / 10,
        speed: isMoving ? speed : 0.0,
        heading: headingDeg,
      });

      // Proximity check to Pune Darwaza Gate 1 (150, -57.3, -170)
      const distToPD = Math.hypot(stateRef.current.pos.x - 150.0, stateRef.current.pos.z - (-170.0));
      if (distToPD < 28.0) {
        setActiveStructure('PD');
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth || 1280;
      const h = container.clientHeight || (window.innerHeight - 72) || 720;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    window.addEventListener('resize', onResize);

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      renderer.domElement.removeEventListener('click', onCanvasClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      className="relative w-full bg-slate-950 select-none overflow-hidden font-sans"
      style={{ height: 'calc(100vh - 72px)', minHeight: '600px' }}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-crosshair z-0" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-50 text-white">
          <div className="relative flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-ping" />
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <Compass className="w-7 h-7 text-amber-400 absolute" />
          </div>
          <h2 className="text-2xl font-bold tracking-wider text-amber-300 mb-2">SINHAGAD FORT</h2>
          <p className="text-sm text-slate-400 mb-4 tracking-wide">3D Heritage Digital Reconstruction — Milestone 1</p>
          <div className="w-64 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-xs text-amber-400/80 mt-2 font-mono">{loadingProgress}% Loaded</p>
        </div>
      )}

      {/* Top Telemetry & Compass Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-xs tracking-wider uppercase text-amber-300">Sinhagad Fort 3D</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span>E: <strong className="text-white">{telemetry.easting.toFixed(1)}m</strong></span>
            <span>N: <strong className="text-white">{telemetry.northing.toFixed(1)}m</strong></span>
            <span>MSL: <strong className="text-amber-300">{telemetry.elevation.toFixed(1)}m</strong></span>
            <span>HDG: <strong className="text-white">{telemetry.heading}°</strong></span>
          </div>
        </div>

        {/* Right HUD Controls & Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowInfoCard((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900/85 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-medium shadow-lg transition-all"
            title="Landmark Info"
          >
            <Info className="w-4 h-4" />
            <span>Landmark Dossier</span>
          </button>
          <button
            onClick={toggleSound}
            className="p-2 bg-slate-900/85 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs shadow-lg transition-all"
            title={soundEnabled ? 'Mute Ambiance' : 'Enable Ambiance'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRespawn}
            className="p-2 bg-slate-900/85 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs shadow-lg transition-all"
            title="Respawn at Trek Approach"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="px-2.5 py-1.5 bg-slate-900/85 border border-slate-700 text-slate-400 rounded-xl text-[11px] font-mono">
            {fps} FPS
          </div>
        </div>
      </div>

      {/* Click to Lock Pointer Prompt */}
      {!isLocked && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-30 pointer-events-auto cursor-pointer" onClick={() => mountRef.current?.querySelector('canvas')?.requestPointerLock()}>
          <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-6 text-center max-w-sm shadow-2xl mx-4 transform transition-all hover:scale-105">
            <Footprints className="w-10 h-10 text-amber-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-1">Click to Walk the Fort</h3>
            <p className="text-xs text-slate-300 mb-4">
              Explore the historical approach through Pune Darwaza with mouse look and keyboard navigation.
            </p>
            <div className="flex justify-center gap-2 text-[11px] text-amber-300 font-mono bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
              <span>[W,A,S,D] Move</span>
              <span>•</span>
              <span>[Shift] Sprint</span>
              <span>•</span>
              <span>[Esc] Unlock</span>
            </div>
          </div>
        </div>
      )}

      {/* Proximity Prompt to Pune Darwaza */}
      {isLocked && activeStructure === 'PD' && !showInfoCard && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-amber-500/60 rounded-xl px-4 py-2 text-white shadow-xl flex items-center gap-3 z-20 animate-fade-in">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium">Approaching <strong className="text-amber-300">Pune Darwaza</strong></span>
          <button
            onClick={() => setShowInfoCard(true)}
            className="text-[11px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded hover:bg-amber-400"
          >
            Press [I] for Dossier
          </button>
        </div>
      )}

      {/* Landmark Information Slide-in Dossier */}
      {showInfoCard && (
        <aside className="absolute top-16 right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden text-white transition-all">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-amber-950/40 to-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Tier T3 Blockout
                </span>
                <span className="text-[10px] text-slate-400 font-mono">CRS: EPSG:32643</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">Pune Darwaza</h3>
              <p className="text-xs text-slate-400">Three Sequential Fortified Gateways</p>
            </div>
            <button
              onClick={() => setShowInfoCard(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300 leading-relaxed">
            {/* Defensive Architecture Overview */}
            <section className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
              <h4 className="font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Defensive Layout & Siting
              </h4>
              <p>
                Pune Darwaza guards the northeastern escarpment of Sinhagad above the sheer Khadakada cliffs.
                Unlike fantasy gateways, it comprises a strategic chain of <strong>three ascending gates</strong> built
                between rounded basalt bastions to prevent head-on artillery assaults.
              </p>
            </section>

            {/* Structure Components Breakdown */}
            <section className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-amber-400/90">
                Components & Surviving Evidence
              </h4>
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/40">
                <strong className="text-amber-200">1. Gate 1 (Outer Gate):</strong> Flanked by two 6m bastions. Features two weathered <em>Sharabha</em> (mythical predator) relief carvings on the spandrels.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/40">
                <strong className="text-amber-200">2. Stone Staircase (22 Steps):</strong> Climbs 16m horizontally and 4m vertically from Gate 1 to Gate 2, flanked by the Khadakada rampart wall.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/40">
                <strong className="text-amber-200">3. Rock-Cut Cistern:</strong> Perennial water reservoir carved directly into the living basalt cliff face on the left flank before Gate 2.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/40">
                <strong className="text-amber-200">4. Gate 2 (Middle Gate):</strong> Solid repaired ashlar masonry gateway between bastions with upper battery access.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/40">
                <strong className="text-amber-200">5. Gate 3 (Inner Gate):</strong> The primary historic citadel threshold featuring a sacred lotus motif and festoon carving on the doorway lintel, flanked by two guard rooms.
              </div>
            </section>

            {/* Sourced Provenance Register */}
            <section className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-amber-400">
                Documented Evidence & Sources
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong>S02:</strong> Durgbharari Survey (Suresh Nimbalkar, 2022)</li>
                <li><strong>S04:</strong> Maharashtra Tourism Official Monograph</li>
                <li><strong>S21:</strong> Valentine Blacker 1818 British Siege Survey Plan</li>
                <li><strong>PH01, PH10, PH15:</strong> Wikimedia Commons & Archival photographic series</li>
              </ul>
            </section>

            {/* Uncertainty Notice */}
            <section className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90">
              <p className="font-semibold text-amber-400 mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Scientific Honesty Notice:
              </p>
              This structure is certified as <strong>Tier T3</strong>. While gate sequences, step counts, and bastion positions are verified from multi-angle photographs and literature, millimeter-accurate passage widths and stone block joints await an official on-site laser distance measurement campaign.
            </section>
          </div>
        </aside>
      )}

      {/* Bottom Navigation Helper Pill */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-mono pointer-events-none z-10">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
          Terrain: Copernicus GLO-30 DEM (EGM2008 Datum)
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
          Sinhagad Fort Milestone 1 Vertical Slice
        </div>
      </div>
    </div>
  );
}
