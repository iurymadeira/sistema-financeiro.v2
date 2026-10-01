'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, TrendingUp, History, Sparkles } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-500' },
    { name: 'Movimentações', href: '/movimentacoes', icon: ArrowLeftRight, color: 'from-emerald-500 to-teal-500' },
    { name: 'Histórico', href: '/historico', icon: History, color: 'from-purple-500 to-pink-500' },
    { name: 'Projeção Futura', href: '/projecao', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
];

export function Sidebar() {
    const pathname = usePathname();

    const playSound = (freq = 600, type: OscillatorType = 'sine', duration = 0.04) => {
        try {
            const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch {
            // Ignora se o áudio estiver desativado
        }
    };

    return (
        <aside className="w-64 h-screen bg-black text-white p-4 flex flex-col justify-between border-r border-zinc-900 relative overflow-hidden shrink-0">
            <div>
                <div className="flex items-center gap-3 px-3 py-4 mb-6">
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                        FinControl
                    </span>
                </div>

                <nav className="space-y-2 relative">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    onMouseEnter={() => playSound(600, 'sine', 0.04)}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm overflow-hidden ${isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-90 rounded-xl`}
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}

                                    <span className="relative z-10">
                                        <Icon className="w-5 h-5" />
                                    </span>
                                    <span className="relative z-10">{item.name}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 text-xs text-zinc-400 text-center">
                Status: <span className="text-emerald-400 font-semibold">● Backend Ativo</span>
            </div>
        </aside>
    );
}