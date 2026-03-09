'use client';

import React from 'react';
import { m } from 'framer-motion';
import { Shield, LayoutGrid, Cpu, Network, Zap } from 'lucide-react';

interface FallbackProps {
    type: 'orb' | 'background' | 'scanner' | 'network' | 'sphere';
    status?: string;
}

export const VisualFallback: React.FC<FallbackProps> = ({ type, status }) => {
    if (type === 'orb') {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <m.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 360],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                />
                <m.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="p-8 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-md"
                >
                    <Shield className="w-16 h-16 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </m.div>
            </div>
        );
    }

    if (type === 'scanner') {
        return (
            <div className="relative w-full h-full bg-slate-900/50 rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center justify-center group">
                {/* Simulated Grid */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                />

                {/* Moving Scanline */}
                <m.div
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)] z-10"
                />

                <div className="relative z-0 flex flex-col items-center">
                    <m.div
                        animate={{ scale: [0.95, 1, 0.95] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <LayoutGrid className="w-20 h-20 text-blue-500/40 mb-4" />
                    </m.div>
                    <span className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.4em]">Optimizing Metadata</span>
                </div>
            </div>
        );
    }

    if (type === 'network') {
        return (
            <div className="relative w-full h-full flex items-center justify-center opacity-40">
                <div className="absolute inset-0 flex items-center justify-center">
                    {[1, 2, 3].map((i) => (
                        <m.div
                            key={i}
                            animate={{
                                rotate: [0, 360],
                                scale: [0.8, 1, 0.8]
                            }}
                            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                            className="absolute rounded-full border border-blue-500/20"
                            style={{ width: `${100 + i * 60}px`, height: `${100 + i * 60}px` }}
                        />
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-12 relative z-10">
                    {[Cpu, Network, Zap].map((Icon, idx) => (
                        <m.div
                            key={idx}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3 + idx, repeat: Infinity }}
                            className="p-4 bg-slate-800/80 rounded-2xl border border-blue-500/30"
                        >
                            <Icon className="w-8 h-8 text-blue-400" />
                        </m.div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'sphere') {
        const colorClass = status === 'High Risk' ? 'bg-red-500' : status === 'Medium Risk' ? 'bg-amber-500' : 'bg-emerald-500';
        const shadowClass = status === 'High Risk' ? 'shadow-red-500/50' : status === 'Medium Risk' ? 'shadow-amber-500/50' : 'shadow-emerald-500/50';

        return (
            <div className="relative flex flex-col items-center justify-center">
                <m.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={`absolute w-16 h-16 rounded-full ${colorClass} blur-xl opacity-40`}
                />
                <m.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`relative w-12 h-12 rounded-full ${colorClass} border-2 border-white/20 shadow-2xl ${shadowClass} flex items-center justify-center overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-white/40" />
                </m.div>
            </div>
        );
    }

    // Default: Background pulse
    return (
        <div className="fixed inset-0 pointer-events-none -z-40">
            <m.div
                animate={{ opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5"
            />
        </div>
    );
};
