// src/services/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Contratos de dados (Interfaces TypeScript) para garantir a segurança dos dados
export interface Transacao {
    id?: number;
    descricao: string;
    valor: number;
    tipo: 'RECEITA' | 'DESPESA';
    recorrente: boolean;
    frequencia?: 'MENSAL' | 'ANUAL' | 'SEMANAL';
    categoriaId?: number;
    data: string;
}

export interface DadosFormularioProjecao {
    saldoInicial: number;
    gastosFixos: number;
    receitasFixas: number;
    anos: number;
    transacoesVariaveis?: Transacao[];
}

export const financeiroService = {
    /**
     * Envia os dados financeiros para o backend calcular a projeção futura
     */
    async calcularProjecao(dadosFormulario: DadosFormularioProjecao) {
        try {
            const resposta = await fetch(`${API_URL}/calcular`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFormulario),
            });

            if (!resposta.ok) {
                const erroBody = await resposta.json();
                throw new Error(erroBody.erro || 'Erro ao processar cálculo no servidor.');
            }

            return await resposta.json();
        } catch (erro) {
            console.error('Erro ao calcular projeção:', erro);
            throw erro;
        }
    },

    /**
     * Carrega o estado atual salvo no banco de dados através da API
     */
    async carregarEstado() {
        try {
            const resposta = await fetch(`${API_URL}/carregar`);
            if (!resposta.ok) return null;
            return await resposta.json();
        } catch (erro) {
            console.error('Erro ao carregar estado:', erro);
            return null;
        }
    },

    /**
     * Procura todas as movimentações (receitas e despesas) registadas
     */
    async listarTransacoes(): Promise<Transacao[]> {
        try {
            const resposta = await fetch(`${API_URL}/transacoes`);
            if (!resposta.ok) return [];
            return await resposta.json();
        } catch (erro) {
            console.error('Erro ao procurar transações:', erro);
            return [];
        }
    },

    /**
     * Regista uma nova receita ou despesa no backend
     */
    async criarTransacao(transacao: Transacao) {
        try {
            const resposta = await fetch(`${API_URL}/transacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transacao),
            });

            if (!resposta.ok) {
                throw new Error('Falha ao registar movimentação.');
            }

            return await resposta.json();
        } catch (erro) {
            console.error('Erro ao criar transação:', erro);
            throw erro;
        }
    },

    /**
     * Obtém a lista de categorias configuradas no sistema
     */
    async listarCategorias() {
        try {
            const resposta = await fetch(`${API_URL}/categorias`);
            if (!resposta.ok) return [];
            return await resposta.json();
        } catch (erro) {
            console.error('Erro ao procurar categorias:', erro);
            return [];
        }
    }
};