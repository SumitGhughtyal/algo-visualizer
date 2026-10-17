"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Shape colors, taken from the reference image
const COLORS = {
  big: 0x0f7a42, // large sphere and left ring
  mid: 0x1a8a4f, // sphere peeking above center
  deep: 0x075a24, // big ring at the bottom
  small: 0x0b7a30, // small sphere
  ambient: 0x7dffb0, // tint of the soft light that fills the shadow side
  fill: 0x2cff88, // colored light on the shapes' edges
};

// Opening motion: each shape eases in from beyond its screen edge
const INTRO_SECONDS = 1.2; // how long each shape takes to settle
const INTRO_STAGGER = 0.1; // delay between one shape and the next
const INTRO_TRAVEL = 0.4; // how far outside its place a shape starts (fraction of the half-screen)
const INTRO_SCALE_FROM = 0.7; // starting size, as a fraction of the final size

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface Item {
  mesh: THREE.Mesh;
  fx: number; // horizontal position: -1 = left edge of the screen, 1 = right edge
  fy: number; // vertical position: -1 = bottom edge, 1 = top edge
  z: number; // depth (negative = further back)
  baseX: number; // settled position, filled in by resize()
  baseY: number;
  halfW: number; // half the visible width and height at this shape's depth
  halfH: number;
  delay: number; // when this shape starts moving, in seconds
  phase: number;
  speed: number; // bobbing speed
  spin: number; // rotation speed
}

export default function SceneBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // If the browser can't create a WebGL context, skip the 3D scene quietly
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Neutral tone mapping keeps the greens saturated (the older ACES mode washed them out)
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio reflections, kept weak so they don't wash the color out
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.25;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Lights: a green ambient (so shadows are dark green, not gray),
    // a strong white key light from the top left, and a small green rim light
    scene.add(new THREE.AmbientLight(COLORS.ambient, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 6.0);
    key.position.set(-5, 4, 5);
    scene.add(key);
    const fill = new THREE.PointLight(COLORS.fill, 12, 18);
    fill.position.set(5, -3, 3);
    scene.add(fill);

    const world = new THREE.Group();
    scene.add(world);

    const items: Item[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Satin material with mint-tinted highlights (the reference highlights are green-white, not white)
    const glossy = (color: number) =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0,
        roughness: 0.32,
        specularColor: new THREE.Color(0x9affc0),
        specularIntensity: 0.9,
        clearcoat: 0.3,
        clearcoatRoughness: 0.25,
      });

    function add(
      geometry: THREE.BufferGeometry,
      color: number,
      fx: number,
      fy: number,
      z: number,
      phase: number,
      speed: number,
      spin: number,
      tilt: [number, number] = [0, 0],
    ) {
      const material = glossy(color);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.set(tilt[0], tilt[1], 0);
      world.add(mesh);
      geometries.push(geometry);
      materials.push(material);
      items.push({
        mesh,
        fx,
        fy,
        z,
        baseX: 0,
        baseY: 0,
        halfW: 0,
        halfH: 0,
        delay: items.length * INTRO_STAGGER,
        phase,
        speed,
        spin,
      });
    }

    // The shapes. fx and fy place each one relative to the screen edges (see Item above)
    add(new THREE.SphereGeometry(1.5, 96, 96), COLORS.big, 0.78, 0.29, -1.0, 0.0, 0.5, 0.1); // large sphere, right
    add(new THREE.SphereGeometry(1.0, 96, 96), COLORS.mid, 0.1, 0.69, -1.6, 1.6, 0.45, 0.1); // sphere peeking above center
    add(new THREE.TorusGeometry(1.45, 0.5, 64, 160), COLORS.big, -0.84, -0.07, -0.8, 2.7, 0.4, 0.15, [1.0, 0.5]); // ring, left
    add(new THREE.TorusGeometry(2.2, 0.65, 64, 160), COLORS.deep, 0.07, -0.75, -2.0, 4.1, 0.3, 0.1, [1.2, 0.2]); // big ring, bottom
    add(new THREE.SphereGeometry(0.32, 64, 64), COLORS.small, 0.9, -0.2, 0.8, 5.3, 0.8, 0.2); // small sphere near the edge

    // Gentle parallax: the whole scene leans toward the mouse
    const pointer = { x: 0, y: 0 };
    function onPointerMove(e: PointerEvent) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointerMove);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let time = 0;
    let frame = 0;
    let scaleK = 1; // screen-size factor, set in resize()

    function draw() {
      renderer.render(scene, camera);
    }

    function loop() {
      const dt = clock.getDelta();
      time += dt;
      for (const item of items) {
        // Opening motion: progress goes 0 to 1 over INTRO_SECONDS, starting at this shape's delay
        const progress = THREE.MathUtils.clamp((time - item.delay) / INTRO_SECONDS, 0, 1);
        const eased = easeOutCubic(progress);
        const away = (1 - eased) * INTRO_TRAVEL; // 0 once the shape has settled

        item.mesh.position.x = item.baseX + item.fx * item.halfW * away;
        item.mesh.position.y =
          item.baseY + item.fy * item.halfH * away + Math.sin(time * item.speed + item.phase) * 0.25;
        item.mesh.scale.setScalar(scaleK * (INTRO_SCALE_FROM + (1 - INTRO_SCALE_FROM) * eased));
        item.mesh.rotation.y += item.spin * dt;
      }
      world.rotation.y += (pointer.x * 0.12 - world.rotation.y) * 0.05;
      world.rotation.x += (pointer.y * 0.08 - world.rotation.x) * 0.05;
      draw();
      frame = requestAnimationFrame(loop);
    }

    function resize() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Shape size follows the screen: 1 on a 1920 x 1080 monitor,
      // about 0.75 on a 1440 x 900 laptop, never below 0.45
      scaleK = THREE.MathUtils.clamp(Math.min(w / 1900, window.innerHeight / 1050), 0.45, 1);

      // Settled position of every shape, relative to the visible edges at its own depth
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      for (const item of items) {
        item.halfH = tan * (camera.position.z - item.z);
        item.halfW = item.halfH * camera.aspect;
        item.baseX = item.fx * item.halfW;
        item.baseY = item.fy * item.halfH;
        item.mesh.position.set(item.baseX, item.baseY, item.z);
        item.mesh.scale.setScalar(scaleK);
      }
      if (reduceMotion) draw();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    if (reduceMotion) {
      draw(); // one still frame, no animation
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="scene-in pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}