import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Shield, AlertTriangle, Scale, Activity, Cpu, FileText, Wrench, CheckCircle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

const MOCK_PIE_DATA = [
    { name: 'Safe', value: 85, color: '#10b981' },
    { name: 'At Risk', value: 10, color: '#f59e0b' },
    { name: 'Critical', value: 5, color: '#ef4444' },
];

const MOCK_BAR_DATA = [
    { name: 'Missing', value: 12, color: '#f59e0b' },
    { name: 'Duplicates', value: 3, color: '#3b82f6' },
    { name: 'Outliers', value: 5, color: '#ef4444' },
];

const TABS = [
    { id: 'audit', label: 'Data Auditing', icon: Activity },
    { id: 'bias', label: 'Bias & Fairness', icon: Scale },
    { id: 'risk', label: 'Future Risk', icon: AlertTriangle },
    { id: 'genai', label: 'GenAI Simulation', icon: Cpu },
    { id: 'explain', label: 'Explainable AI', icon: FileText },
    { id: 'fix', label: 'Fix Suggestions', icon: Wrench },
];

export function Dashboard({ results }: { results: any }) {
    const [activeTab, setActiveTab] = useState('audit');

    if (!results) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'audit':
                return (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                            <Activity className="w-16 h-16 text-emerald-400 mb-4" />
                            <h3 className="text-4xl font-bold text-white mb-2">{results.audit?.score || 85}%</h3>
                            <p className="text-slate-400 text-lg">Real-Time Data Quality Score</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold mb-4">Quality Metrics Breakdown</h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={MOCK_BAR_DATA}>
                                        <XAxis dataKey="name" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {MOCK_BAR_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl lg:col-span-2">
                            <h3 className="text-xl font-semibold mb-4">Identified Inconsistencies</h3>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-full" /> {results.audit?.missing_values || 12} missing values across 3 columns</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> {results.audit?.duplicates || 3} exact duplicate records found</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full" /> {results.audit?.outliers || 5} extreme statistical outliers detected in 'income' column</li>
                            </ul>
                        </div>
                    </m.div>
                );
            case 'bias':
                return (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="glass-card p-6 rounded-2xl lg:col-span-1 border-t-4 border-t-blue-500">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Scale className="text-blue-400" /> Fairness Metrics</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2"><span className="text-slate-300">Demographic Parity</span> <span className="font-bold">{(results.bias?.demographic_parity * 100).toFixed(0)}%</span></div>
                                    <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${results.bias?.demographic_parity * 100}%` }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2"><span className="text-slate-300">Equal Opportunity</span> <span className="font-bold">{(results.bias?.equal_opportunity * 100).toFixed(0)}%</span></div>
                                    <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${results.bias?.equal_opportunity * 100}%` }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2"><span className="text-slate-300">Disparate Impact</span> <span className="font-bold text-red-400">{(results.bias?.disparate_impact * 100).toFixed(0)}%</span></div>
                                    <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${results.bias?.disparate_impact * 100}%` }}></div></div>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl lg:col-span-2">
                            <h3 className="text-xl font-semibold mb-4 text-rose-200">Detected Demographic Biases</h3>
                            <div className="space-y-4">
                                {results.bias?.issues?.map((issue: string, idx: number) => (
                                    <div key={idx} className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-4">
                                        <AlertTriangle className="text-rose-400 mt-1 shrink-0" />
                                        <p className="text-rose-100/90 leading-relaxed">{issue}</p>
                                    </div>
                                ))}
                                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4">
                                    <AlertTriangle className="text-amber-400 mt-1 shrink-0" />
                                    <p className="text-amber-100/90 leading-relaxed">Minor age group disparity detected in samples over 60 years old. Potential representation issue.</p>
                                </div>
                            </div>
                        </div>
                    </m.div>
                );
            case 'risk':
                return (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-rose-500 blur-2xl rounded-full opacity-20 animate-pulse" />
                                <Shield className="w-20 h-20 text-rose-400 relative z-10" />
                            </div>
                            <h2 className="text-5xl font-black text-white mb-2">{results.simulate?.overall_risk_score}</h2>
                            <p className="text-xl text-rose-300 font-semibold mb-1">{results.simulate?.risk_category} Risk Score</p>
                            <p className="text-slate-400 mt-4 text-sm max-w-xs">Score represents the likelihood of model failure or unfair decision making in production.</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold mb-6">Predicted Model Outcomes</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                    <span className="text-slate-300">Biased Decisions</span>
                                    <span className="text-rose-400 font-medium tracking-wide">HIGH PROBABILITY</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                    <span className="text-slate-300">Model Instability</span>
                                    <span className="text-amber-400 font-medium tracking-wide">MEDIUM PROBABILITY</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                    <span className="text-slate-300">Incorrect Predictions</span>
                                    <span className="text-emerald-400 font-medium tracking-wide">LOW PROBABILITY</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                    <span className="text-slate-300">Unsafe Outcomes</span>
                                    <span className="text-rose-400 font-medium tracking-wide">HIGH PROBABILITY</span>
                                </div>
                            </div>
                        </div>
                    </m.div>
                );
            case 'genai':
                return (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card p-8 rounded-2xl overflow-hidden relative">
                        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />
                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Cpu className="text-purple-400 w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">10,000 Scenarios Simulated</h3>
                                <p className="text-slate-400">Testing AI behavior under extreme and rare conditions using LLM Agents.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {results.simulate?.simulated_scenarios?.map((scenario: any, idx: number) => (
                                <div key={idx} className="bg-slate-800/60 p-5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                    <h4 className="font-semibold text-purple-200 mb-2">{scenario.name}</h4>
                                    <p className="text-sm text-slate-400 mb-4 tracking-wide">Impact Testing</p>
                                    <div className={`px-3 py-1 text-xs font-bold rounded-full inline-block ${scenario.impact.includes('High') ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                            scenario.impact.includes('Medium') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        }`}>
                                        {scenario.impact.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </m.div>
                );
            case 'explain':
                return (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card p-8 rounded-2xl">
                        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2"><FileText className="text-blue-400" /> Human-Readable Explainable AI Report</h3>
                        <div className="prose prose-invert max-w-none">
                            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-xl space-y-4">
                                <p className="text-xl text-blue-100 leading-relaxed font-light italic">
                                    "Dataset shows significant <strong className="text-white">gender bias</strong>. Male samples represent <strong>82%</strong> of the dataset."
                                </p>
                                <p className="text-lg text-blue-200/80 leading-relaxed">
                                    This skew in the training distribution could lead to highly unfair predictions. When this model encounters female demographics in production, its confidence will drop, and the error rate will spike, particularly affecting critical automated decision systems.
                                </p>
                                <p className="text-lg text-blue-200/80 leading-relaxed">
                                    Additionally, the <strong className="text-white">disparate impact</strong> metric indicates that the model favors the majority class at a rate of 1.4x compared to the minority class.
                                </p>
                            </div>
                        </div>
                    </m.div>
                );
            case 'fix':
                return (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card p-8 rounded-2xl border border-emerald-500/20">
                        <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg"><Wrench className="text-emerald-400" /></div>
                            Automated Data Fix Suggestions
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Balance dataset via SMOTE for minority classes (Female).",
                                "Remove 5 critical statistical outliers in 'income' column.",
                                "Impute missing values in feature correlation matrix.",
                                "Apply reweighting algorithms applied to heavily biased samples.",
                                "Implement pre-processing fairness correction techniques (AIF360 algorithm)."
                            ].map((fix, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-emerald-900/10 rounded-xl border border-emerald-500/10 hover:bg-emerald-900/20 transition-all cursor-default">
                                    <CheckCircle className="text-emerald-500 w-6 h-6 shrink-0 mt-0.5" />
                                    <p className="text-emerald-100/90">{fix}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                            <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95">
                                Apply Guardian Fixes Automatically
                            </button>
                        </div>
                    </m.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-10">
            {/* Custom Tab Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300 ${isActive
                                    ? 'text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <m.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 bg-blue-600 rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-200' : ''}`} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <div key={activeTab}>
                        {renderTabContent()}
                    </div>
                </AnimatePresence>
            </div>
        </div>
    );
}
