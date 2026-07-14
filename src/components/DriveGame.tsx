import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, ContactShadows, Float, Sky, Stars, useGLTF } from '@react-three/drei';
import { MutableRefObject, Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export type DriveInput = { left: boolean; right: boolean; accelerate: boolean; brake: boolean };

interface DriveGameProps {
  inputRef: MutableRefObject<DriveInput>;
  cameraMode: 'chase' | 'cockpit';
  rain: boolean;
  night: boolean;
  onSpeedChange: (speed: number) => void;
}

function RealCar({ carX }: { carX: MutableRefObject<number> }) {
  const car = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/car-concept.glb');
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
  useFrame(() => {
    if (car.current) car.current.position.x = THREE.MathUtils.lerp(car.current.position.x, carX.current, 0.18);
  });
  return (
    <group ref={car} position={[0, 0.05, 2.2]}>
      <Center bottom rotation={[0, Math.PI, 0]} scale={0.78}>
        <primitive object={model} />
      </Center>
      <ContactShadows position={[0, 0.02, 0]} opacity={0.75} scale={7} blur={1.8} far={4} />
      <spotLight position={[-0.7, 0.8, -2]} target-position={[-0.7, 0, -22]} angle={0.32} penumbra={0.5} intensity={70} distance={45} color="#d8f2ff" />
      <spotLight position={[0.7, 0.8, -2]} target-position={[0.7, 0, -22]} angle={0.32} penumbra={0.5} intensity={70} distance={45} color="#d8f2ff" />
    </group>
  );
}

function Roadside({ z, side }: { z: number; side: number }) {
  const isShop = Math.abs(z) % 80 === 0;
  return (
    <group position={[side * 9, 0, z]}>
      {isShop ? <>
        <mesh position={[0, 1.4, 0]}><boxGeometry args={[4, 2.8, 3]} /><meshStandardMaterial color={side > 0 ? '#17594a' : '#8a3b12'} /></mesh>
        <mesh position={[0, 2.2, -1.53]}><boxGeometry args={[3.5, 0.65, 0.08]} /><meshStandardMaterial color="#ffd45c" emissive="#ff8c2a" emissiveIntensity={2} /></mesh>
      </> : <>
        <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.18, 0.25, 3]} /><meshStandardMaterial color="#5b4636" /></mesh>
        <Float speed={1.5} floatIntensity={0.15}><mesh position={[0, 3, 0]}><sphereGeometry args={[1.25, 10, 8]} /><meshStandardMaterial color="#17472d" /></mesh></Float>
      </>}
    </group>
  );
}

function Highway({ speed }: { speed: MutableRefObject<number> }) {
  const world = useRef<THREE.Group>(null);
  const zs = useMemo(() => Array.from({ length: 18 }, (_, i) => -i * 20), []);
  useFrame((_, delta) => {
    if (!world.current) return;
    world.current.children.forEach((child) => {
      child.position.z += speed.current * delta;
      if (child.position.z > 18) child.position.z -= 360;
    });
  });
  return (
    <group ref={world}>
      {zs.map((z, i) => <group key={z} position={[0, 0, z]}>
        <mesh receiveShadow position={[0, -0.08, 0]}><boxGeometry args={[12, 0.18, 20]} /><meshStandardMaterial color="#23272b" roughness={0.95} /></mesh>
        <mesh position={[0, 0.025, 0]}><boxGeometry args={[0.11, 0.025, 8]} /><meshStandardMaterial color="#faf2bc" emissive="#cfc48a" emissiveIntensity={0.4} /></mesh>
        <mesh position={[-5.7, 0.02, 0]}><boxGeometry args={[0.18, 0.03, 20]} /><meshStandardMaterial color="#f7f7ee" /></mesh>
        <mesh position={[5.7, 0.02, 0]}><boxGeometry args={[0.18, 0.03, 20]} /><meshStandardMaterial color="#f7f7ee" /></mesh>
        <Roadside z={0} side={i % 2 ? 1 : -1} />
      </group>)}
    </group>
  );
}

function Traffic({ speed }: { speed: MutableRefObject<number> }) {
  const cars = useRef<THREE.Group>(null);
  const data = useMemo(() => [[-3, -35, '#b91c1c'], [3, -70, '#d1d5db'], [-3, -118, '#eab308'], [3, -175, '#2563eb']] as const, []);
  useFrame((_, delta) => {
    cars.current?.children.forEach((car, i) => {
      car.position.z += Math.max(5, speed.current - 9 - i) * delta;
      if (car.position.z > 15) car.position.z -= 210;
    });
  });
  return <group ref={cars}>{data.map(([x, z, color]) => <group key={z} position={[x, 0.55, z]}>
    <mesh castShadow><boxGeometry args={[1.7, 0.8, 3.3]} /><meshStandardMaterial color={color} metalness={0.4} /></mesh>
    <mesh position={[0, 0.55, 0.25]}><boxGeometry args={[1.45, 0.52, 1.65]} /><meshStandardMaterial color="#283845" /></mesh>
    <mesh position={[-0.55, 0, 1.67]}><boxGeometry args={[0.35, 0.18, 0.05]} /><meshStandardMaterial color="#ff2c20" emissive="#ff1308" emissiveIntensity={4} /></mesh>
    <mesh position={[0.55, 0, 1.67]}><boxGeometry args={[0.35, 0.18, 0.05]} /><meshStandardMaterial color="#ff2c20" emissive="#ff1308" emissiveIntensity={4} /></mesh>
  </group>)}</group>;
}

function Rain() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => Float32Array.from({ length: 900 }, (_, i) => i % 3 === 0 ? (Math.random() - 0.5) * 35 : i % 3 === 1 ? Math.random() * 22 : -Math.random() * 100 + 10), []);
  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.position.y -= delta * 18;
    if (points.current.position.y < -10) points.current.position.y = 10;
  });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#9ed8ff" size={0.06} transparent opacity={0.7} /></points>;
}

function GameWorld({ inputRef, cameraMode, rain, night, onSpeedChange }: DriveGameProps) {
  const speed = useRef(0);
  const carX = useRef(0);
  const lastReported = useRef(0);
  const { camera } = useThree();
  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    perspectiveCamera.fov = cameraMode === 'cockpit' ? 72 : 52;
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, cameraMode]);
  useFrame((_, delta) => {
    const input = inputRef.current;
    const target = input.brake ? 0 : input.accelerate ? 38 : 20;
    speed.current = THREE.MathUtils.lerp(speed.current, target, Math.min(1, delta * (input.brake ? 3 : 0.8)));
    const steer = (input.left ? -1 : 0) + (input.right ? 1 : 0);
    carX.current = THREE.MathUtils.clamp(carX.current + steer * delta * (2.8 + speed.current * 0.06), -4.5, 4.5);
    const desired = cameraMode === 'cockpit' ? new THREE.Vector3(carX.current, 1.75, 1.25) : new THREE.Vector3(carX.current, 4.2, 9.2);
    camera.position.lerp(desired, 0.12);
    camera.lookAt(carX.current, cameraMode === 'cockpit' ? 1.15 : 0.8, cameraMode === 'cockpit' ? -18 : -4);
    if (performance.now() - lastReported.current > 150) { onSpeedChange(Math.round(speed.current * 4.7)); lastReported.current = performance.now(); }
  });
  return <>
    <color attach="background" args={[night ? '#030712' : '#55b9ef']} />
    <fog attach="fog" args={[night ? '#07111b' : '#a8dcf2', night ? 18 : 55, night ? 115 : 190]} />
    <ambientLight intensity={night ? 0.45 : 1.35} color={night ? '#91a8c7' : '#dff4ff'} />
    <directionalLight position={[night ? 10 : -25, night ? 18 : 35, night ? 8 : -20]} intensity={night ? 1.2 : 4.2} color={night ? '#dce9ff' : '#fff1bd'} castShadow />
    {!night && <Sky distance={450000} sunPosition={[-25, 35, -50]} inclination={0.52} azimuth={0.22} turbidity={3.5} rayleigh={1.2} mieCoefficient={0.006} mieDirectionalG={0.82} />}
    {night && <Stars radius={90} depth={40} count={1200} factor={3} fade speed={0.4} />}
    <Highway speed={speed} /><Traffic speed={speed} />
    <Suspense fallback={null}><RealCar carX={carX} /></Suspense>
    {rain && <Rain />}
  </>;
}

export function DriveGame(props: DriveGameProps) {
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 4.2, 9.2], fov: 52 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
    <GameWorld {...props} />
  </Canvas>;
}

useGLTF.preload('/models/car-concept.glb');
