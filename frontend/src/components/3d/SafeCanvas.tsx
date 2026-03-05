'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, Props as CanvasProps } from '@react-three/fiber';
import { VisualFallback } from './VisualFallback';
import { ErrorBoundary } from 'react-error-boundary';

interface SafeCanvasProps extends CanvasProps {
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

    useEffect(() => {
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
    }, []);

    // While checking, show nothing or a static placeholder
    if (webGLAvailable === null) return null;

    if (!webGLAvailable) {
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
