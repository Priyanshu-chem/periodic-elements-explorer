'use client';

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AtomicModel3DProps {
  atomicNumber: number;
  atomicMass?: number;
  shellModel: number[];
}

function Nucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const nucleonRadius = 0.12;
  const nucleons = useMemo(() => {
    const items: { pos: THREE.Vector3; type: 'proton' | 'neutron' }[] = [];
    const total = protons + neutrons;
    const maxR = Math.cbrt(total) * nucleonRadius * 1.4;

    for (let i = 0; i < total; i++) {
      let pos: THREE.Vector3;
      let attempts = 0;
      do {
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.random() * Math.PI * 2;
        const r = maxR * Math.cbrt(Math.random());
        pos = new THREE.Vector3(
          r * Math.sin(theta) * Math.cos(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(theta),
        );
        attempts++;
      } while (
        attempts < 30 &&
        items.some((other) => other.pos.distanceTo(pos) < nucleonRadius * 1.6)
      );
      items.push({ pos, type: i < protons ? 'proton' : 'neutron' });
    }
    return items;
  }, [protons, neutrons]);

  return (
    <group>
      {nucleons.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[nucleonRadius, 12, 12]} />
          <meshStandardMaterial
            color={n.type === 'proton' ? '#ff5555' : '#6b9cce'}
            emissive={n.type === 'proton' ? '#ff3333' : '#3a6a8d'}
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      ))}
      <pointLight intensity={0.6} distance={4} decay={1} color="#ff8844" />
    </group>
  );
}

function ElectronShell({
  radius,
  tiltAngle,
  electronCount,
  speed,
  phase,
}: {
  radius: number;
  tiltAngle: number;
  electronCount: number;
  speed: number;
  phase: number;
}) {
  const electronsRef = useRef<THREE.Group>(null);

  const electrons = useMemo(() => {
    const items: { angleOffset: number }[] = [];
    for (let i = 0; i < electronCount; i++) {
      items.push({ angleOffset: (i / electronCount) * Math.PI * 2 });
    }
    return items;
  }, [electronCount]);

  useFrame((state) => {
    if (electronsRef.current) {
      electronsRef.current.children.forEach((child, i) => {
        if (!electrons[i]) return;
        const angle = state.clock.elapsedTime * speed + electrons[i].angleOffset + phase;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        child.position.set(x, 0, z);
      });
    }
  });

  return (
    <group rotation={[tiltAngle, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.03, radius + 0.03, 64]} />
        <meshBasicMaterial
          color="#66ddff"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <group ref={electronsRef}>
        {electrons.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial
              color="#ffdd44"
              emissive="#ffaa00"
              emissiveIntensity={1.0}
              transparent
              opacity={1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AtomContent({ atomicNumber, atomicMass, shellModel }: AtomicModel3DProps) {
  const protonCount = atomicNumber;
  const neutronCount = Math.round((atomicMass ?? atomicNumber * 2)) - atomicNumber;

  const shellConfigs = useMemo(() => {
    const baseRadius = 1.5;
    const radiusStep = 1.3;
    return shellModel.map((count, index) => ({
      radius: baseRadius + radiusStep * index,
      tiltAngle: (index * 30 + 10) * (Math.PI / 180),
      electronCount: count,
      speed: 1.5 - index * 0.18,
      phase: index * 1.5,
    }));
  }, [shellModel]);

  return (
    <group>
      <Nucleus protons={protonCount} neutrons={Math.max(0, neutronCount)} />
      {shellConfigs.map((config, i) => (
        <ElectronShell key={i} {...config} />
      ))}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} castShadow />
      <hemisphereLight args={['#4488ff', '#44ff88', 0.3]} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  );
}

function AtomScene(props: AtomicModel3DProps) {
  const totalShells = props.shellModel.length;
  const scale = 1 / (1.5 + totalShells * 0.6);

  return (
    <group scale={scale}>
      <Suspense fallback={<LoadingFallback />}>
        <AtomContent {...props} />
      </Suspense>
    </group>
  );
}

export default function AtomicModel3D(props: AtomicModel3DProps) {
  return (
    <Canvas
      camera={{ position: [4, 3, 6], fov: 50, near: 0.1, far: 30 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <AtomScene {...props} />
      <OrbitControls enableDamping dampingFactor={0.1} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
