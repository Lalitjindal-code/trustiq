'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function GuardianOrb() {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color="#3b82f6"
                    speed={3}
                    distort={0.4}
                    radius={1}
                    emissive="#6366f1"
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>

            {/* Outer Wireframe Shield */}
            <Sphere args={[1.4, 32, 32]}>
                <meshStandardMaterial
                    color="#818cf8"
                    wireframe
                    transparent
                    opacity={0.1}
                />
            </Sphere>
        </Float>
    );
}
