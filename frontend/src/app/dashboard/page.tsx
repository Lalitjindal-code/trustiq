'use client';

import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Uploader } from '@/components/Uploader';
import { Dashboard } from '@/components/Dashboard';
import { api, type AuditResult, type BiasResult, type SimulationResult } from '@/lib/api';
import {
    ShieldCheck, Loader2, Database, Activity, Scale,
    BrainCircuit, CheckCircle, AlertTriangle, FileText, ChevronRight,
    Info, Clock, Code, ListChecks, Check, UploadCloud, XCircle
} from 'lucide-react';
import Link from 'next/link';
import { SafeCanvas } from '@/components/3d/SafeCanvas';
import { VisualFallback } from '@/components/3d/VisualFallback';

// Lazy load 3D components
const ParticleBackground = lazy(() => import('@/components/3d/ParticleBackground').then(m => ({ default: m.ParticleBackground })));
const AIBrain = lazy(() => import('@/components/3d/AIBrain').then(m => ({ default: m.AIBrain })));
const DatasetScanner = lazy(() => import('@/components/3d/DatasetScanner').then(m => ({ default: m.DatasetScanner })));
const RiskSphere = lazy(() => import('@/components/3d/RiskSphere').then(m => ({ default: m.RiskSphere })));
const FeatureNetwork = lazy(() => import('@/components/3d/FeatureNetwork').then(m => ({ default: m.FeatureNetwork })));
const GuardianOrb = lazy(() => import('@/components/3d/GuardianOrb').then(m => ({ default: m.GuardianOrb })));

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [progressText, setProgressText] = useState('');
    const [analyzedFile, setAnalyzedFile] = useState<string>('');
    const [previewData, setPreviewData] = useState<{ headers: string[], rows: string[][] }>({ headers: [], rows: [] });
    const [datasetStats, setDatasetStats] = useState({ rows: 0, cols: 0 });

    const [results, setResults] = useState<{
        audit?: AuditResult,
        bias?: BiasResult,
        simulate?: SimulationResult
    } | null>(null);

    const parseCSVForPreview = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (text) {
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length > 0) {
                    const headers = lines[0].split(',').map(h => h.trim());
                    const rows = lines.slice(1, 11).map(line => line.split(',').map(cell => cell.trim()));
                    setPreviewData({ headers, rows });
                    setDatasetStats({ rows: lines.length - 1, cols: headers.length });
                }
            }
        };
        reader.readAsText(file);
    };

    const handleUpload = async (file: File) => {
        setIsProcessing(true);
        setResults(null);
        setAnalysisStep(1);
        setAnalyzedFile(file.name);

        if (file.name.endsWith('.csv')) {
            parseCSVForPreview(file);
        } else {
            setPreviewData({ headers: [], rows: [] });
        }

        try {
            setAnalysisStep(1);
            setProgressText('Data Parsing & Ingestion...');
            await api.uploadFile(file);

            setAnalysisStep(2);
            setProgressText('Feature Detection & Auditing...');
            const auditRes = await api.runAudit();

            setAnalysisStep(3);
            setProgressText('Bias & Fairness Analysis...');
            const biasRes = await api.runBiasDetection();

            setAnalysisStep(4);
            setProgressText('Risk Simulation with GenAI...');
            const simulateRes = await api.runSimulation();

            setAnalysisStep(5);
            setProgressText('Generating Explainable Insights...');
            await new Promise(r => setTimeout(r, 1000));

            setResults({
                audit: auditRes,
                bias: biasRes,
                simulate: simulateRes
            });

        } catch (error) {
            console.error('Processing failed:', error);
            alert('Failed to process dataset. Please ensure backend is running.');
        } finally {
            setIsProcessing(false);
            setAnalysisStep(0);
        }
    };

    const loadSampleDataset = (type: string) => {
        const dummyContent = "id,age,gender,income,loan_approved\n1,25,Male,45000,1\n2,35,Female,60000,1\n3,22,Male,30000,0\n4,45,Female,,0\n5,55,Male,120000,1\n6,28,Female,48000,0\n7,28,Female,48000,0\n8,60,Male,150000,1\n9,21,Female,20000,0\n10,40,Male,80000,1\n11,32,,65000,1\n12,200,Female,-5000,0";
        const file = new File([dummyContent], `${type}_dataset.csv`, { type: 'text/csv' });
        handleUpload(file);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen py-16 px-4 md:px-8 relative overflow-hidden font-sans bg-[#020617] text-slate-200">
            {/* 3D Background Particles - Safe Wrapper */}
            <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
                <SafeCanvas
                    fallbackType="background"
                    camera={{ position: [0, 0, 20], fov: 75 }}
                    gl={{ alpha: true }}
                >
                    <ParticleBackground />
                </SafeCanvas>
            </div>

            {/* Vibrant Background Blurs */}
            <div className="fixed inset-0 overflow-hidden -z-40 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[130px]" />
                <div className="absolute top-[30%] right-[-10%] w-[50%] h-[70%] rounded-full bg-purple-600/20 blur-[160px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
            </div>

            <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 px-4 relative z-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:border-blue-500/50 transition-all shadow-lg shadow-blue-500/5">
                        <ShieldCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-white">Data Guardian</span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Guardian</span>
                        <span className="text-sm font-bold text-white">{user?.displayName || user?.email}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-all bg-white/5 px-6 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
                <motion.header
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24 relative"
                >
                    {/* Hero Section 3D AI Guardian Model - Safe Wrapper */}
                    <div className="absolute left-1/2 -top-36 -translate-x-1/2 w-64 h-64 -z-10 select-none pointer-events-none overflow-hidden rounded-full">
                        <SafeCanvas
                            fallbackType="orb"
                            camera={{ position: [0, 0, 5], fov: 40 }}
                            gl={{ alpha: true }}
                        >
                            <ambientLight intensity={1.5} />
                            <pointLight position={[10, 10, 10]} intensity={3} color="#3b82f6" />
                            <AIBrain />
                        </SafeCanvas>
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="p-5 bg-blue-500/15 rounded-[2rem] border border-blue-400/30 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                            <ShieldCheck className="w-14 h-14 text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none text-white">
                        Intelligent <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm">Analysis</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                        Data security meets AI intelligence. Securely audit, detect bias, and simulate risks in seconds.
                    </p>
                </motion.header>

                <AnimatePresence mode="wait">
                    {!isProcessing && !results && (
                        <motion.div
                            key="uploader"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="w-full max-w-5xl mb-20 hidden md:block">
                                <div className="flex justify-between items-center bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                                    {[
                                        { label: 'Upload', icon: UploadCloud },
                                        { label: 'Audit', icon: Activity },
                                        { label: 'Bias', icon: Scale },
                                        { label: 'Simulate', icon: BrainCircuit },
                                        { label: 'Report', icon: FileText }
                                    ].map((s, i, arr) => (
                                        <div key={i} className="flex items-center">
                                            <div className="flex flex-col items-center gap-4 group">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 shadow-inner group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500">
                                                    <s.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{s.label}</span>
                                            </div>
                                            {i < arr.length - 1 && (
                                                <div className="w-16 h-[2px] bg-gradient-to-r from-slate-700 to-slate-800 mx-6 opacity-30" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-10 items-start mb-20">
                                <div className="lg:col-span-1 space-y-8">
                                    <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-white/[0.03] shadow-2xl">
                                        <h3 className="text-xl font-bold mb-8 flex items-center gap-4 text-white">
                                            <div className="p-2.5 bg-blue-500/20 rounded-xl">
                                                <ListChecks className="w-6 h-6 text-blue-400" />
                                            </div>
                                            Checklist
                                        </h3>
                                        <ul className="space-y-5 text-sm font-medium text-slate-400">
                                            <li className="flex items-start gap-4 hover:text-white transition-colors"><Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> CSV / JSON datasets</li>
                                            <li className="flex items-start gap-4 hover:text-white transition-colors"><Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Structured schemas</li>
                                            <li className="flex items-start gap-4 hover:text-white transition-colors"><Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Target features</li>
                                            <li className="flex items-start gap-4 hover:text-white transition-colors"><Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Max size 50MB</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="lg:col-span-2 flex flex-col items-center">
                                    <div className="w-full transform transition-all hover:scale-[1.01] duration-500">
                                        <Uploader onUpload={handleUpload} />
                                    </div>

                                    <div className="mt-12 text-center w-full">
                                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Test with Samples</p>
                                        <div className="flex flex-wrap justify-center gap-5">
                                            {[
                                                { id: 'credit_risk', label: 'Credit Risk', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
                                                { id: 'healthcare', label: 'Medical Inequity', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
                                                { id: 'hiring_bias', label: 'HR Fairness', color: 'text-purple-400', glow: 'shadow-purple-500/20' }
                                            ].map((sample) => (
                                                <button
                                                    key={sample.id}
                                                    onClick={() => loadSampleDataset(sample.id)}
                                                    className={`group px-6 py-3.5 rounded-[1.5rem] bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/10 text-xs font-bold flex items-center gap-4 hover:border-white/30 hover:shadow-2xl ${sample.glow}`}
                                                >
                                                    <Database className={`w-5 h-5 ${sample.color} group-hover:scale-110 transition-transform`} />
                                                    {sample.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-1 space-y-8">
                                    <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-white/[0.03] shadow-2xl">
                                        <h3 className="text-xl font-bold mb-8 flex items-center gap-4 text-white">
                                            <div className="p-2.5 bg-purple-500/20 rounded-xl">
                                                <Clock className="w-6 h-6 text-purple-400" />
                                            </div>
                                            History
                                        </h3>
                                        <ul className="space-y-6">
                                            {[
                                                { name: 'fin_risk_v2.csv', status: 'Analysis Done', color: 'text-blue-400' },
                                                { name: 'clinical_trials.csv', status: 'High Risk', color: 'text-red-400' },
                                                { name: 'user_cohort_B.csv', status: 'Safe', color: 'text-emerald-400' }
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex flex-col gap-2 group cursor-pointer">
                                                    <span className="text-slate-300 font-bold truncate text-sm group-hover:text-white transition-colors">{item.name}</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                                        {item.status}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Inspection Grid */}
                            <div className="w-full max-w-7xl pb-40 text-center relative px-4">
                                <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none overflow-hidden">
                                    <SafeCanvas
                                        fallbackType="network"
                                        camera={{ position: [0, 0, 10] }}
                                        gl={{ alpha: true }}
                                    >
                                        <ambientLight intensity={1.5} />
                                        <pointLight position={[10, 10, 10]} intensity={3} color="#3b82f6" />
                                        <FeatureNetwork />
                                    </SafeCanvas>
                                </div>

                                <h2 className="text-4xl font-black mb-16 text-white tracking-tighter">Enterprise Quality Layer</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 text-left">
                                    {[
                                        { img: Activity, title: 'Compliance', desc: 'Auto-detect policy breaches.' },
                                        { img: Scale, title: 'Inclusion', desc: 'Identify marginalized bias.' },
                                        { img: BrainCircuit, title: 'Predictive', desc: 'Future-risk impact scores.' },
                                        { img: Code, title: 'Simulation', desc: 'Edge case generation.' },
                                        { img: Info, title: 'Logic View', desc: 'Human readable AI logic.' },
                                        { img: CheckCircle, title: 'Auto-Fix', desc: 'One-click data repair.' }
                                    ].map((f, idx) => (
                                        <div key={idx} className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] transition-all hover:border-white/20 hover:-translate-y-2 group shadow-xl">
                                            <div className="p-4 bg-blue-500/10 rounded-2xl w-fit mb-6 group-hover:bg-blue-500/20 transition-colors">
                                                <f.img className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <h4 className="text-sm font-black text-white mb-3 tracking-tight">{f.title}</h4>
                                            <p className="text-[11px] text-slate-500 leading-relaxed font-bold">{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {isProcessing && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center py-24 w-full max-w-3xl px-12 bg-slate-900/60 backdrop-blur-[100px] rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.1)] mb-40"
                        >
                            <div className="w-full h-64 mb-16 relative overflow-hidden rounded-3xl">
                                <div className="p-8">
                                    <VisualFallback type="scanner" />
                                </div>
                            </div>

                            <h3 className="text-4xl font-black mb-4 text-white tracking-tighter">Secure Processing</h3>
                            <p className="text-blue-400 text-lg font-bold mb-16 animate-pulse tracking-wide">{progressText}</p>

                            <div className="w-full space-y-6">
                                {[
                                    { step: 1, label: 'Encrypted Parsing' },
                                    { step: 2, label: 'Feature Correlation' },
                                    { step: 3, label: 'Bias Inspection' },
                                    { step: 4, label: 'Risk Simulation' },
                                    { step: 5, label: 'Report Generation' }
                                ].map((item) => (
                                    <div key={item.step} className="flex items-center gap-6 group">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${analysisStep > item.step ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : analysisStep === item.step ? 'bg-blue-600 text-white border border-blue-400' : 'bg-slate-800/50 text-slate-600 border border-white/5'}`}>
                                            {analysisStep > item.step ? <Check className="w-5 h-5" /> : <span className="text-xs font-black">{item.step}</span>}
                                        </div>
                                        <span className={`text-base font-bold tracking-tight transition-colors duration-500 ${analysisStep >= item.step ? 'text-white' : 'text-slate-600'}`}>
                                            {item.label}
                                        </span>
                                        {analysisStep === item.step && (
                                            <div className="flex-1 h-1 bg-white/5 overflow-hidden rounded-full ml-4">
                                                <motion.div
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '100%' }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {results && !isProcessing && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full pb-40"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 max-w-7xl mx-auto px-6">
                                <div>
                                    <div className="flex flex-wrap items-center gap-6 mb-6">
                                        <h2 className="text-5xl font-black text-white tracking-tightest">Guardian Report</h2>
                                        {results.audit?.status === 'Low Risk' && <span className="px-6 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10">Safe Protocol</span>}
                                        {results.audit?.status === 'Medium Risk' && <span className="px-6 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-500/10">Elevated Priority</span>}
                                        {results.audit?.status === 'High Risk' && <span className="px-6 py-2 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/10">Risk Detected</span>}
                                    </div>
                                    <p className="text-slate-500 text-lg font-medium flex items-center gap-4">
                                        Analysed Resource <span className="text-blue-400 bg-blue-500/10 px-4 py-1 rounded-xl font-bold font-mono text-sm">{analyzedFile}</span>
                                    </p>
                                </div>

                                <button
                                    onClick={() => setResults(null)}
                                    className="px-10 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm hover:translate-y-[-4px] hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] transition-all flex items-center gap-3"
                                >
                                    <UploadCloud className="w-5 h-5" /> Analyze New
                                </button>
                            </div>

                            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-20 items-stretch px-6">
                                <div className="md:col-span-1 rounded-[3rem] bg-slate-900/60 border border-white/10 p-8 flex flex-col items-center justify-center min-h-[250px] shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-24 h-24 mb-4">
                                        <VisualFallback type="sphere" status={results.audit?.status} />
                                    </div>
                                    <span className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Stability Node</span>
                                </div>

                                <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        { label: 'Total Rows', value: datasetStats.rows, icon: Database, color: 'text-blue-400' },
                                        { label: 'Columns', value: datasetStats.cols, icon: Activity, color: 'text-indigo-400' },
                                        { label: 'Null Values', value: results.audit?.missing_values, icon: AlertTriangle, color: 'text-amber-400' },
                                        { label: 'Duplicates', value: results.audit?.duplicates, icon: XCircle, color: 'text-purple-400' }
                                    ].map((stat, i) => (
                                        <div key={i} className="glass-card p-10 rounded-[3rem] border border-white/10 bg-white/[0.03] flex flex-col justify-between group hover:border-white/20 hover:bg-white/[0.05] transition-all shadow-2xl">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                                </div>
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                            </div>
                                            <span className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                                                {stat.value !== undefined ? stat.value.toLocaleString() : '---'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {previewData.headers.length > 0 && (
                                <div className="max-w-7xl mx-auto mb-32 px-6">
                                    <div className="flex items-center gap-8 mb-12">
                                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.5em] flex items-center gap-4">
                                            <Activity className="w-5 h-5 text-blue-500" /> Deep inspection <span className="text-blue-500/50">First 10</span>
                                        </h3>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>

                                    <div className="rounded-[3rem] border border-white/10 overflow-hidden bg-slate-900/60 backdrop-blur-3xl shadow-3xl">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-white/5 border-b border-white/10">
                                                        {previewData.headers.map((header, i) => (
                                                            <th key={i} className="px-10 py-8 font-black text-slate-400 uppercase tracking-widest border-r border-white/10 last:border-r-0">{header}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 font-mono">
                                                    {previewData.rows.map((row, i) => (
                                                        <tr key={i} className="hover:bg-blue-500/5 transition-all group">
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="px-10 py-6 text-slate-400 group-hover:text-blue-300 border-r border-white/5 last:border-r-0 transition-colors">
                                                                    {cell || <span className="text-red-500/50 font-sans italic font-bold">NULL</span>}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Dashboard results={results} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
