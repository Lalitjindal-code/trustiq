'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const AIBrain = () => {
    const leftHemisphereRef = useRef<THREE.Mesh>(null!);
    const rightHemisphereRef = useRef<THREE.Mesh>(null!);
    const pointsRef = useRef<THREE.Points>(null!);

    // Generate neural connection points
    const count = 200;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            const radius = 1.2 + Math.random() * 0.4;
            pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
            pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Pulse effect
        const pulse = 1 + Math.sin(time * 1.5) * 0.05;

        if (leftHemisphereRef.current) {
            leftHemisphereRef.current.scale.set(pulse, pulse, pulse);
            leftHemisphereRef.current.rotation.y = time * 0.2;
        }

        if (rightHemisphereRef.current) {
            rightHemisphereRef.current.scale.set(pulse, pulse, pulse);
            rightHemisphereRef.current.rotation.y = time * 0.2;
        }

        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.1;
            pointsRef.current.rotation.z = time * 0.05;
        }
    });

    return (
        <group scale={1.2}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Left Hemisphere */}
                <Sphere ref={leftHemisphereRef} args={[1, 64, 64]} position={[-0.1, 0, 0]}>
                    <MeshDistortMaterial
                        color="#4f46e5"
                        speed={2}
                        distort={0.4}
                        radius={1}
                        metalness={0.6}
                        roughness={0.2}
                        emissive="#1e1b4b"
                        emissiveIntensity={1.5}
                    />
                </Sphere>

                {/* Right Hemisphere */}
                <Sphere ref={rightHemisphereRef} args={[1, 64, 64]} position={[0.1, 0, 0]}>
                    <MeshDistortMaterial
                        color="#3b82f6"
                        speed={2.5}
                        distort={0.4}
                        radius={1}
                        metalness={0.6}
                        roughness={0.2}
                        emissive="#1e3a8a"
                        emissiveIntensity={1.5}
                    />
                </Sphere>

                {/* Neural Connections (Points) */}
                <Points ref={pointsRef} positions={positions} stride={3}>
                    <PointMaterial
                        transparent
                        color="#818cf8"
                        size={0.06}
                        sizeAttenuation={true}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        opacity={0.8}
                    />
                </Points>
            </Float>

            {/* Core Glow */}
            <Sphere args={[0.5, 32, 32]}>
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#6366f1"
                    emissiveIntensity={4}
                    transparent
                    opacity={0.3}
                />
            </Sphere>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#818cf8" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
        </group>
    );
};
