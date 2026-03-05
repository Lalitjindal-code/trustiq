'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

export function FeatureNetwork() {
    const groupRef = useRef<THREE.Group>(null!);

    const nodes = useMemo(() => [
        { pos: [2, 1, 0], label: 'Audit' },
        { pos: [-2, 1, 1], label: 'Bias' },
        { pos: [0, -1, 2], label: 'Risk' },
        { pos: [2, -2, -1], label: 'Simulation' },
        { pos: [-2, -2, 0], label: 'XAI' },
        { pos: [0, 2, -1], label: 'Fixes' },
    ], []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        groupRef.current.rotation.y = time * 0.1;
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    });

    return (
        <group ref={groupRef} scale={1.2}>
            {nodes.map((node, i) => (
                <group key={i} position={node.pos as [number, number, number]}>
                    <Sphere args={[0.15, 16, 16]}>
                        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} />
                    </Sphere>
                    <Text
                        position={[0, 0.35, 0]}
                        fontSize={0.2}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {node.label}
                    </Text>
                </group>
            ))}

            {/* Connection Lines */}
            {nodes.map((node, i) =>
                nodes.slice(i + 1).map((other, j) => (
                    <Line
                        key={`${i}-${j}`}
                        points={[node.pos as [number, number, number], other.pos as [number, number, number]]}
                        color="#3b82f6"
                        lineWidth={0.5}
                        transparent
                        opacity={0.2}
                    />
                ))
            )}
        </group>
    );
}
