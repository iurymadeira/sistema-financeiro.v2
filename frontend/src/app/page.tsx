'use client';

import { Sidebar } from '@/components/navigation/Sidebar';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Menu Lateral */}
      <Sidebar />

      {/* Área de Conteúdo Principal (Preto Puro #000000) */}
      <main className="flex-1 overflow-y-auto p-8 relative bg-black">
        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
              Visão Geral Financeira
            </h1>
            <p className="text-sm text-zinc-400 mt-1 font-medium">
              Passe o mouse ou clique nos cards para interagir com os efeitos.
            </p>
          </div>
        </header>

        {/* Grade de Cards Interativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <InteractiveCard
            title="Saldo Atual"
            value="R$ 0,00"
            subtitle="A aguardar dados do backend"
            icon={<Wallet className="w-5 h-5" />}
            gradientColors="from-blue-600 via-indigo-500 to-purple-600"
            glowColor="rgba(99, 102, 241, 0.25)"
          />

          <InteractiveCard
            title="Receitas"
            value="R$ 0,00"
            subtitle="Entradas mensais acumuladas"
            icon={<ArrowUpRight className="w-5 h-5" />}
            gradientColors="from-emerald-500 via-teal-400 to-cyan-500"
            glowColor="rgba(16, 185, 129, 0.25)"
          />

          <InteractiveCard
            title="Despesas"
            value="R$ 0,00"
            subtitle="Saídas mensais acumuladas"
            icon={<ArrowDownRight className="w-5 h-5" />}
            gradientColors="from-rose-600 via-pink-500 to-orange-500"
            glowColor="rgba(244, 63, 94, 0.25)"
          />
        </div>
      </main>
    </div>
  );
}