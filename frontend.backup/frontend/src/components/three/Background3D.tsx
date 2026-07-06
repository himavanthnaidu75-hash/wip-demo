'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/store/useStore';

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 800;
  const theme = useAppStore((s) => s.theme);
  const scrollY = useAppStore((s) => s.scrollY);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 24;
      pos[i3 + 1] = (Math.random() - 0.5) * 24;
      pos[i3 + 2] = (Math.random() - 0.5) * 24;
      vel[i3] = (Math.random() - 0.5) * 0.004;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.004;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.004;
    }
    return [pos, vel];
  }, [count]);

  const targetColor = useMemo(() => new THREE.Color(theme.particleColor), [theme.particleColor]);
  const currentColor = useRef(new THREE.Color(theme.particleColor));

  useFrame((_, delta) => {
    if (!mesh.current) return;

    // Lerp color
    currentColor.current.lerp(targetColor, 0.02);
    (mesh.current.material as THREE.PointsMaterial).color.copy(currentColor.current);

    // Scroll-based vertical drift — particles shift opposite to scroll for parallax
    const scrollOffset = scrollY * 0.003;

    const posAttr = mesh.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3] += velocities[i3] * delta * 60 * theme.particleSpeed;
      array[i3 + 1] += (velocities[i3 + 1] * delta * 60 * theme.particleSpeed) - (scrollOffset * delta * 0.5);
      array[i3 + 2] += velocities[i3 + 2] * delta * 60 * theme.particleSpeed;

      for (let j = 0; j < 3; j++) {
        if (array[i3 + j] > 12) array[i3 + j] = -12;
        if (array[i3 + j] < -12) array[i3 + j] = 12;
      }
    }
    posAttr.needsUpdate = true;
    mesh.current.rotation.y += 0.0003 * theme.particleSpeed;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={theme.particleSize}
        color={theme.particleColor}
        transparent
        opacity={theme.particleOpacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WireframeShape() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const theme = useAppStore((s) => s.theme);
  const scrollY = useAppStore((s) => s.scrollY);

  const targetWireColor = useMemo(() => new THREE.Color(theme.wireColor), [theme.wireColor]);
  const currentWireColor = useRef(new THREE.Color(theme.wireColor));

  const detail = theme.geometryDetail;
  const geo = useMemo(() => new THREE.IcosahedronGeometry(2, detail), [detail]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current || !edgesRef.current) return;

    // Lerp wire color
    currentWireColor.current.lerp(targetWireColor, 0.02);
    (edgesRef.current.material as THREE.LineBasicMaterial).color.copy(currentWireColor.current);
    (meshRef.current.material as THREE.MeshBasicMaterial).color.copy(currentWireColor.current);

    // Rotation
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * theme.rotationSpeed.x;
    meshRef.current.rotation.y = t * theme.rotationSpeed.y;
    edgesRef.current.rotation.x = t * theme.rotationSpeed.x;
    edgesRef.current.rotation.y = t * theme.rotationSpeed.y;

    // Scroll parallax — shift the shape vertically and tilt slightly
    const scrollFactor = scrollY * 0.0008;
    groupRef.current.position.y = -scrollFactor * 1.5;
    groupRef.current.rotation.x = t * theme.rotationSpeed.x + scrollFactor * 0.3;
    groupRef.current.rotation.z = scrollFactor * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={theme.floatIntensity}>
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={geo}>
          <meshBasicMaterial transparent opacity={0.02} color={theme.wireColor} />
        </mesh>
        <lineSegments ref={edgesRef}>
          <edgesGeometry args={[geo]} />
          <lineBasicMaterial color={theme.wireColor} transparent opacity={theme.wireOpacity} />
        </lineSegments>
      </group>
    </Float>
  );
}

function SecondaryRing() {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const theme = useAppStore((s) => s.theme);
  const scrollY = useAppStore((s) => s.scrollY);

  const targetColor = useMemo(() => new THREE.Color(theme.wireColor), [theme.wireColor]);
  const currentColor = useRef(new THREE.Color(theme.wireColor));

  const geo = useMemo(() => new THREE.TorusGeometry(3, 0.02, 8, 60), []);

  useFrame((state) => {
    if (!meshRef.current || !edgesRef.current) return;

    currentColor.current.lerp(targetColor, 0.015);
    (meshRef.current.material as THREE.MeshBasicMaterial).color.copy(currentColor.current);
    (edgesRef.current.material as THREE.LineBasicMaterial).color.copy(currentColor.current);

    const t = state.clock.elapsedTime;
    const rot = t * 0.02;
    meshRef.current.rotation.x = rot + 1.2;
    meshRef.current.rotation.y = rot * 0.7;
    edgesRef.current.rotation.x = rot + 1.2;
    edgesRef.current.rotation.y = rot * 0.7;

    // Parallax
    const sf = scrollY * 0.0005;
    meshRef.current.position.y = sf;
    edgesRef.current.position.y = sf;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geo}>
        <meshBasicMaterial transparent opacity={0.03} color={theme.wireColor} />
      </mesh>
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[geo]} />
        <lineBasicMaterial color={theme.wireColor} transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  const currentView = useAppStore((s) => s.currentView);
  const getCameraTarget = useAppStore((s) => s.getCameraTarget);
  const scrollY = useAppStore((s) => s.scrollY);
  const targetRef = useRef(getCameraTarget(currentView));
  const lookAtTarget = useRef(getCameraTarget(currentView));

  useFrame(() => {
    const target = getCameraTarget(currentView);

    // Lerp to target position
    targetRef.current.position[0] += (target.position[0] - targetRef.current.position[0]) * 0.02;
    targetRef.current.position[1] += (target.position[1] - targetRef.current.position[1]) * 0.02;
    targetRef.current.position[2] += (target.position[2] - targetRef.current.position[2]) * 0.02;
    lookAtTarget.current.lookAt[0] += (target.lookAt[0] - lookAtTarget.current.lookAt[0]) * 0.02;
    lookAtTarget.current.lookAt[1] += (target.lookAt[1] - lookAtTarget.current.lookAt[1]) * 0.02;
    lookAtTarget.current.lookAt[2] += (target.lookAt[2] - lookAtTarget.current.lookAt[2]) * 0.02;

    // Scroll parallax: camera shifts up slightly as you scroll down
    const scrollOffset = scrollY * 0.0015;

    camera.position.set(
      targetRef.current.position[0],
      targetRef.current.position[1] - scrollOffset,
      targetRef.current.position[2]
    );
    camera.lookAt(
      lookAtTarget.current.lookAt[0],
      lookAtTarget.current.lookAt[1] - scrollOffset * 0.5,
      lookAtTarget.current.lookAt[2]
    );
  });

  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <WireframeShape />
      <SecondaryRing />
      <Particles />
      <CameraController />
    </>
  );
}

interface Background3DProps {
  opacity?: number;
}

function GlowOrb() {
  const theme = useAppStore((s) => s.theme);
  const scrollY = useAppStore((s) => s.scrollY);

  return (
    <div
      className="fixed pointer-events-none z-[1] rounded-full blur-[120px] transition-colors duration-[2000ms] will-change-transform"
      style={{
        width: 600,
        height: 600,
        top: '20%',
        left: '50%',
        transform: `translateX(-50%) translateY(${-(scrollY) * 0.02}px)`,
        background: theme.accentGlow,
        opacity: 0.6,
      }}
    />
  );
}

export default function Background3D({ opacity = 1 }: Background3DProps) {
  const theme = useAppStore((s) => s.theme);

  return (
    <div className="fixed inset-0 z-0" style={{ opacity }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>

      {/* Atmospheric overlay that changes per demo */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none transition-all duration-[2000ms]"
        style={{
          background: theme.overlayGradient,
        }}
      />

      <GlowOrb />
    </div>
  );
}