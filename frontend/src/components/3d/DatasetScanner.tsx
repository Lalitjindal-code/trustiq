'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function DatasetScanner() {
    const lineRef = useRef<THREE.Mesh>(null!);
    const cubeRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Move scanning line up and down
        lineRef.current.position.y = Math.sin(time * 3) * 1.2;
        // Rotate cube
        cubeRef.current.rotation.y = time * 0.5;
    });

    return (
        <group scale={1.5}>
            {/* Translucent Data Cube */}
            <Box ref={cubeRef} args={[2, 2, 2]}>
                <MeshWobbleMaterial
                    color="#3b82f6"
                    speed={1}
                    factor={0.1}
                    transparent
                    opacity={0.2}
                    wireframe
                />
            </Box>

            {/* Scanning Line */}
            <mesh ref={lineRef}>
                <boxGeometry args={[2.5, 0.05, 2.5]} />
                <meshStandardMaterial
                    color="#60a5fa"
                    emissive="#60a5fa"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Internal Core */}
            <Box args={[0.5, 0.5, 0.5]}>
                <meshStandardMaterial
                    color="#818cf8"
                    emissive="#818cf8"
                    emissiveIntensity={1}
                />
            </Box>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        </group>
    );
}
