'use client';

import React, { useState, useEffect, Suspense } from 'react';

import { Canvas } from '@react-three/fiber';
import { VisualFallback } from './VisualFallback';
import { ErrorBoundary } from 'react-error-boundary';

interface SafeCanvasProps extends React.ComponentProps<typeof Canvas> {
    fallbackType: 'orb' | 'background' | 'scanner' | 'network' | 'sphere';
    fallbackStatus?: string;
    children: React.ReactNode;
}

const WebGLFallbackComponent = ({ type, status }: { type: any, status?: string }) => {
    return <VisualFallback type={type} status={status} />;
};

export const SafeCanvas: React.FC<SafeCanvasProps> = ({
    children,
    fallbackType,
    fallbackStatus,
    ...canvasProps
}) => {
    const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        // Only run Heavy 3D on desktop
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        try {
            const canvas = document.createElement('canvas');
            const support = !!(
                window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
            );
            setWebGLAvailable(support);

            // Cleanup dummy canvas
            canvas.remove();
        } catch (e) {
            setWebGLAvailable(false);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // While checking, show nothing or a static placeholder
    if (webGLAvailable === null || isMobile === null) return null;

    // Fallback on mobile or if WebGL is unavailable
    if (!webGLAvailable || isMobile) {
        return <VisualFallback type={fallbackType} status={fallbackStatus} />;
    }

    return (
        <ErrorBoundary
            fallback={<VisualFallback type={fallbackType} status={fallbackStatus} />}
            onError={(error) => console.error("WebGL Error Boundary caught:", error)}
        >
            <Suspense fallback={null}>
                <Canvas
                    {...canvasProps}
                    onCreated={(state) => {
                        // Monitor for context loss
                        state.gl.domElement.addEventListener('webglcontextlost', (event) => {
                            event.preventDefault();
                            console.warn("WebGL Context Lost - Switching to Fallback");
                            setWebGLAvailable(false);
                        }, false);
                    }}
                >
                    {children}
                </Canvas>
            </Suspense>
        </ErrorBoundary>
    );
};
