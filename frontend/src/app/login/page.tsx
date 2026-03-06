'use client';
import React, { useState, useEffect, Suspense } from 'react';

import Link from 'next/link';
import { ShieldCheck, ArrowRight, Github } from 'lucide-react';
import { SafeCanvas } from '@/components/3d/SafeCanvas';
import { AIBrain } from '@/components/3d/AIBrain';

import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute top-[40%] right-[-10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[150px]" />
            </div>

            <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 relative z-10">

                {/* 3D Visual Side (Hidden on mobile) */}
                <div className="hidden lg:block w-1/2 aspect-square relative">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <SafeCanvas fallbackType="orb" camera={{ position: [0, 0, 5], fov: 40 }}>
                        <AIBrain />
                    </SafeCanvas>
                </div>

                <div className="w-full max-w-md">

                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3 justify-center mb-8 hover:opacity-80 transition-opacity">
                            <ShieldCheck className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                            <span className="font-bold text-3xl tracking-tight text-white">Data Guardian</span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Sign in to your account to continue</p>
                    </div>

                    <div className="glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative">
                        {/* Subtle inner glow */}
                        <div className="absolute inset-0 bg-blue-500/5 rounded-2xl pointer-events-none" />

                        <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-light"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-light"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="mt-8 relative z-10">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#1e293b] text-slate-400">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button className="flex-1 glass-card hover:bg-slate-800 transition-colors border-slate-700 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
                                    <Github className="w-5 h-5" /> GitHub
                                </button>
                                <button
                                    onClick={handleGoogleLogin}
                                    className="flex-1 glass-card hover:bg-slate-800 transition-colors border-slate-700 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                                    Google
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Not a member?{' '}
                        <Link href="/signup" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            Start a 14 day free trial
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
