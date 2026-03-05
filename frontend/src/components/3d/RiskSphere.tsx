'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface RiskSphereProps {
    status?: string;
}

export function RiskSphere({ status = 'Low Risk' }: RiskSphereProps) {
    const meshRef = useRef<THREE.Mesh>(null!);

    const color = status === 'High Risk' ? '#ef4444' : status === 'Medium Risk' ? '#f59e0b' : '#10b981';
    const emissive = status === 'High Risk' ? '#7f1d1d' : status === 'Medium Risk' ? '#78350f' : '#064e3b';

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.y = time * 0.4;
    });

    return (
        <Sphere ref={meshRef} args={[1, 64, 64]}>
            <MeshDistortMaterial
                color={color}
                speed={2}
                distort={0.3}
                radius={1}
                emissive={emissive}
                emissiveIntensity={1}
                roughness={0.1}
                metalness={1}
            />
        </Sphere>
    );
}
