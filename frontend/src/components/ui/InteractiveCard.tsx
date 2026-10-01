'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface InteractiveCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    gradientColors: string; // Ex: 'from-blue-500 via-indigo-500 to-purple-500'
    glowColor: string;     // Ex: 'rgba(99, 102, 241, 0.25)'
}

export function InteractiveCard({
    title,
    value,
    subtitle,
    icon,
    gradientColors,
    glowColor,
}: InteractiveCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Calcula a posição exata do cursor para o efeito Spotlight de luz
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative rounded-2xl p-[1px] cursor-pointer group shadow-2xl bg-black overflow-hidden isolate"
        >
            {/* 1. Borda Animada em Gradiente (Sem rebarbas retas - usando opacity e gradientes contidos) */}
            <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradientColors} transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-30'
                    }`}
            />

            {/* 2. Conteúdo Interno com Fundo Preto Absoluto #000000 e isolamento de borda */}
            <div className="relative rounded-[15px] bg-black p-6 h-full flex flex-col justify-between overflow-hidden z-10 border border-zinc-900/60">

                {/* 3. Efeito Spotlight de luz que acompanha o ponteiro do mouse */}
                <div
                    className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-[15px]"
                    style={{
                        background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 80%)`,
                    }}
                />

                {/* 4. Brilho Instantâneo ao Clicar (Click Flash) */}
                {isClicked && (
                    <motion.div
                        initial={{ opacity: 0.6, scale: 0.95 }}
                        animate={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute inset-0 bg-gradient-to-r ${gradientColors} pointer-events-none z-20 rounded-[15px]`}
                    />
                )}

                {/* Cabeçalho do Card */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <span className="text-sm font-semibold tracking-wide text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        {title}
                    </span>
                    <div
                        className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientColors} text-white shadow-lg transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'
                            }`}
                    >
                        {icon}
                    </div>
                </div>

                {/* Corpo do Card */}
                <div className="relative z-10">
                    <motion.h2
                        animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
                        className="text-3xl font-black text-white tracking-tight"
                    >
                        {value}
                    </motion.h2>
                    <p className="text-xs text-zinc-500 mt-1 font-medium group-hover:text-zinc-400 transition-colors">
                        {subtitle}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}