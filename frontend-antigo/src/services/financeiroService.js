// --- CAMADA DE SERVIÇO DE API (HTTP CLIENT) ---

const API_URL = 'http://localhost:3000/api';

const financeiroService = {
  async calcularProjecao(dadosFormulario) {
    try {
      const resposta = await fetch(`${API_URL}/calcular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFormulario)
      });

      if (!resposta.ok) {
        const erroBody = await resposta.json();
        throw new Error(erroBody.erro || 'Erro ao processar cálculo no servidor.');
      }

      return await resposta.json();
    } catch (erro) {
      console.error('Erro no cliente de API ao calcular:', erro);
      throw erro;
    }
  },

  async carregarEstado() {
    try {
      const resposta = await fetch(`${API_URL}/carregar`);
      if (!resposta.ok) return null;
      return await resposta.json();
    } catch (erro) {
      console.error('Erro no cliente de API ao carregar:', erro);
      return null;
    }
  }
};