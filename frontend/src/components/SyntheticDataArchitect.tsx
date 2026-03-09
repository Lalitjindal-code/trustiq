import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Database, Copy, CheckCircle2, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export function SyntheticDataArchitect() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [schema, setSchema] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError(null);
        setSchema(null);
        setCopied(false);

        try {
            const data = await api.generateSyntheticSchema(prompt);
            setSchema(data);
        } catch (err: any) {
            setError(err.message || 'Failed to generate dataset schema.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!schema) return;
        navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const loadExample = () => {
        setPrompt("Generate a loan approval dataset with 5000 rows with features age, income, credit_score, loan_amount and target loan_approved with slight class imbalance.");
    };

    return (
        <div className="w-full relative z-10 glass-card p-10 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden bg-slate-900/60 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-purple-500/20 rounded-2xl w-fit">
                    <Database className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Synthetic Architect</h2>
                    <p className="text-slate-400 font-medium mt-1">Design production-ready dataset schemas using AI.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">

                {/* Left Side: Input */}
                <div className="flex flex-col gap-6">
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your dataset requirements... (e.g. Generate a healthcare dataset with 10k rows tracking patient vitals and readmission risk...)"
                            className="w-full h-48 bg-slate-950/50 border border-slate-700 rounded-3xl p-6 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none shadow-inner text-sm leading-relaxed"
                            disabled={isGenerating}
                        />
                        <button
                            onClick={loadExample}
                            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                            type="button"
                        >
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            Use Example
                        </button>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Designing Schema...
                            </>
                        ) : (
                            <>
                                <BrainCircuit className="w-5 h-5" />
                                Generate Schema
                            </>
                        )}
                    </button>

                    {error && (
                        <m.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-sm"
                        >
                            <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                            <p>{error}</p>
                        </m.div>
                    )}
                </div>

                {/* Right Side: Output */}
                <div className="flex flex-col h-full bg-slate-950/80 rounded-3xl border border-slate-700/50 overflow-hidden shadow-inner relative">
                    <div className="absolute top-0 left-0 w-full h-12 bg-slate-900 border-b border-slate-700/50 flex items-center justify-between px-4 z-10">
                        <div className="flex gap-2 items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                        </div>
                        <span className="text-xs font-mono text-slate-500">schema.json</span>
                        <button
                            onClick={handleCopy}
                            disabled={!schema}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex-1 p-6 pt-16 overflow-y-auto custom-scrollbar relative">
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <m.div
                                    key="loading"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4"
                                >
                                    <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-purple-500 animate-spin" />
                                    <p className="font-mono text-sm animate-pulse text-purple-400/80">Synthesizing data relationships...</p>
                                </m.div>
                            ) : schema ? (
                                <m.div
                                    key="schema"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                >
                                    <pre className="text-[13px] font-mono leading-relaxed text-blue-300">
                                        {JSON.stringify(schema, null, 2).split('\\n').map((line, i) => (
                                            <div key={i} className="hover:bg-white/5 px-2 rounded -mx-2 transition-colors">
                                                {line}
                                            </div>
                                        ))}
                                    </pre>
                                </m.div>
                            ) : (
                                <m.div
                                    key="empty"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-4"
                                >
                                    <Sparkles className="w-12 h-12 opacity-20" />
                                    <p className="font-medium text-sm">Your AI-generated schema will appear here.</p>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}
