'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowRight, Github, Code } from 'lucide-react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`
            });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px]" />
            </div>

            <div className="w-full max-w-5xl flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden glass-card border border-white/5">

                {/* Left Side: Signup Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 relative z-10 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                            <ShieldCheck className="w-8 h-8 text-blue-400" />
                            <span className="font-bold text-2xl tracking-tight text-white">Data Guardian</span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
                        <p className="text-slate-400 text-sm">Join thousands of data scientists building safer AI.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSignup}>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-xs font-medium text-slate-300 mb-1.5">First name</label>
                                <input
                                    id="first_name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-xs font-medium text-slate-300 mb-1.5">Last name</label>
                                <input
                                    id="last_name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">Work Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jane@company.com"
                                required
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-light text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group px-4 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-xs text-slate-500 text-center mt-4">By signing up, you agree to our Terms of Service and Privacy Policy.</p>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-800/60 pt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-white hover:text-blue-300 transition-colors">
                            Log in
                        </Link>
                    </div>
                </div>

                {/* Right Side: Showcase */}
                <div className="hidden lg:flex w-1/2 p-12 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-l border-white/5 flex-col justify-between relative overflow-hidden">
                    {/* Abstract background geometries */}
                    <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none mix-blend-screen" />

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/20 backdrop-blur-sm">
                            <Code className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Start deploying reliable models today.</h2>
                        <p className="text-blue-200/80 mb-8 font-light">Join the vanguard of machine learning engineers who prioritize fairness, transparency, and safety.</p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0">✓</div>
                                10,000 GenAI Simulators included
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0">✓</div>
                                Real-time demographic bias auditing
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0">✓</div>
                                Automated fix generation
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 glass-card p-4 rounded-xl border border-white/10 mt-12 bg-slate-900/50 backdrop-blur-md">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                            <div>
                                <h4 className="text-sm font-semibold text-white">"Guardian reduced our model failure rate by 85%."</h4>
                                <p className="text-xs text-slate-400">Sarah J. - Lead Data Scientist at FinTech Corp</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
