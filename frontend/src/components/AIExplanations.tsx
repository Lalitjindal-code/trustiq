'use client';

import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Sparkles, BrainCircuit, ChevronRight, Loader2, ListChecks, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api';

export const AIExplanations = ({ metrics }: { metrics: any }) => {
    const [explanation, setExplanation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchExplanation = async () => {
            if (!metrics) return;
            setIsLoading(true);
            try {
                const res = await api.getAIExplanation(metrics);
                setExplanation(res.explanation);
            } catch (error) {
                console.error('Failed to fetch AI explanation:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExplanation();
    }, [metrics]);

    if (!metrics) return null;

    return (
        <div className="max-w-7xl mx-auto mb-20 px-6">
            <div className="flex items-center gap-8 mb-12">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4">
                    <BrainCircuit className="w-5 h-5 text-purple-500" /> AI Governance Intelligence
                </h3>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-card p-12 rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-blue-500/[0.02] border border-white/10 shadow-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <Sparkles className="w-32 h-32 text-blue-400" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-500/20 rounded-2xl">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                            </div>
                            <h4 className="text-xl font-black text-white tracking-tight">AI Risk Assessment</h4>
                        </div>

                        {isLoading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-4 text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <span className="font-bold text-sm uppercase tracking-widest animate-pulse">Analyzing Metrics with RAG...</span>
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                                    {explanation || "Generating insights based on your dataset metrics..."}
                                </p>
                            </div>
                        )}
                    </div>
                </m.div>

                <div className="space-y-8">
                    <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-white/[0.03] shadow-2xl group hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2.5 bg-purple-500/20 rounded-xl">
                                <ShieldAlert className="w-5 h-5 text-purple-400" />
                            </div>
                            <h4 className="font-bold text-white">Suggested Fixes</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Balance sensitive features using oversampling.",
                                "Apply KNN Imputation for missing values.",
                                "Monitor outliers in numeric features.",
                                "Review disparate impact in target labels."
                            ].map((fix, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-400 font-bold group-hover:text-slate-300 transition-colors">
                                    <ChevronRight className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                    {fix}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-white/[0.03] shadow-2xl group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                                <ListChecks className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h4 className="font-bold text-white">Platform Benefits</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-bold">
                            Trustiq RAG engine leverages industry standards to provide contextually relevant advice for ML compliance and safety.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
