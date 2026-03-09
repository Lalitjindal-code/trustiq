'use client';

import { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const AIChat = ({ datasetContext }: { datasetContext?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your Trustiq AI Assistant. I can help you understand your dataset risks and provide governance recommendations. What would you like to know?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await api.chatWithAI(userMsg, datasetContext);
            setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please ensure the backend is running." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 p-4 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-500/20 text-white flex items-center gap-3 border border-blue-400/30"
            >
                <div className="relative">
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border-2 border-blue-600" />
                </div>
                <span className="font-bold text-sm pr-1">Guardian AI</span>
            </m.button>

            <AnimatePresence>
                {isOpen && (
                    <m.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-8 z-50 w-full max-w-[400px] h-[600px] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-4xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-xl">
                                    <Bot className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">Trustiq Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Guardian Model</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`p-2 h-fit rounded-lg ${msg.role === 'user' ? 'bg-blue-600/20' : 'bg-slate-800'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4 text-blue-400" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                                        </div>
                                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[85%]">
                                        <div className="p-2 h-fit rounded-lg bg-slate-800">
                                            <Bot className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl bg-white/5 text-slate-400 border border-white/5 rounded-tl-none flex items-center gap-2">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Assistant is thinking...
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-white/5 border-t border-white/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask anything about the dataset..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600 shadow-inner"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 top-2 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-all shadow-lg text-white"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="mt-3 text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                <Sparkles className="w-3 h-3 text-blue-400" /> Powered by RAG Infrastructure
                            </p>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
};
