'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, File, CheckCircle } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

interface UploaderProps {
    onUpload: (file: File) => void;
}

export function Uploader({ onUpload }: UploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setFile(e.dataTransfer.files[0]);
            }
        },
        []
    );

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (file) {
            onUpload(file);
        }
    };

    return (
        <m.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="glass-card rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-white/10 relative overflow-hidden group">

                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 gradient-text">Proactive Data Analysis</h2>
                    <p className="text-slate-400">Upload your dataset to begin fairness and risk evaluation</p>
                </div>

                <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                    <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden
              ${isDragging
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                            }
            `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleChange}
                            accept=".csv,.json"
                        />

                        <AnimatePresence mode="wait">
                            {!file ? (
                                <m.div
                                    key="upload"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none"
                                >
                                    <m.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    >
                                        <UploadCloud className="w-16 h-16 text-blue-400 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                    </m.div>
                                    <p className="mb-2 text-lg text-slate-300">
                                        <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-sm text-slate-500">CSV, JSON (MAX. 50MB)</p>
                                </m.div>
                            ) : (
                                <m.div
                                    key="file"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex flex-col items-center justify-center pt-5 pb-6"
                                >
                                    <CheckCircle className="w-16 h-16 text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <p className="text-lg font-medium text-slate-200 mb-1">{file.name}</p>
                                    <p className="text-sm text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </label>
                </form>

                <AnimatePresence>
                    {file && (
                        <m.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="flex justify-center"
                        >
                            <button
                                onClick={handleUploadClick}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
                            >
                                <span>Initialize Guardian Protocol</span>
                                <m.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    →
                                </m.span>
                            </button>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </m.div>
    );
}
