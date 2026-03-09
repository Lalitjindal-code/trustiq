'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { FileText, Download, Loader2, CheckCircle2, FileJson, FileCode } from 'lucide-react';
import { api } from '@/lib/api';

export const ReportGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastFormat, setLastFormat] = useState<string | null>(null);

    const handleGenerate = async (format: string) => {
        setIsGenerating(true);
        setLastFormat(null);
        try {
            await api.generateReport(format);
            setLastFormat(format);
        } catch (error) {
            console.error('Report generation failed:', error);
            alert('Failed to generate report. Please ensure the backend is running.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mb-20 px-6">
            <div className="flex items-center gap-8 mb-12">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4">
                    <FileText className="w-5 h-5 text-indigo-500" /> Governance Reports
                </h3>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { format: 'markdown', label: 'Markdown Report', icon: FileCode, desc: 'Best for documentation and READMEs.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { format: 'json', label: 'JSON Dataset', icon: FileJson, desc: 'Machine readable governance audit.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { format: 'pdf', label: 'PDF Audit (Coming)', icon: FileText, desc: 'Professional PDF report for teams.', color: 'text-rose-400', bg: 'bg-rose-500/10', disabled: true }
                ].map((item) => (
                    <m.div
                        key={item.format}
                        whileHover={item.disabled ? {} : { y: -8 }}
                        className={`glass-card p-10 rounded-[3rem] border border-white/10 ${item.bg} flex flex-col hover:border-white/20 transition-all ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => !item.disabled && handleGenerate(item.format)}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl bg-white/5`}>
                                <item.icon className={`w-8 h-8 ${item.color}`} />
                            </div>
                            {lastFormat === item.format && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                        </div>
                        <h4 className="text-xl font-black text-white mb-3 tracking-tight">{item.label}</h4>
                        <p className="text-xs text-slate-500 font-bold mb-8 leading-relaxed">
                            {item.desc}
                        </p>

                        <button
                            disabled={isGenerating || item.disabled}
                            className={`mt-auto flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isGenerating && lastFormat === null ? 'bg-white/5 text-slate-600' : 'bg-white text-slate-950 hover:shadow-xl'}`}
                        >
                            {isGenerating && !item.disabled ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Download
                                </>
                            )}
                        </button>
                    </m.div>
                ))}
            </div>
        </div>
    );
};
