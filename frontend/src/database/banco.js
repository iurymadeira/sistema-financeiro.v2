// --- CAMADA DE PERSISTÊNCIA VIA API BACKEND ---

const API_URL = 'http://localhost:3000/api';

const banco = {
  /**
   * Salva o estado atual enviando uma requisição POST para o Backend
   * @param {Object} estadoObjeto 
   */
  async salvarEstado(estadoObjeto) {
    try {
      const resposta = await fetch(`${API_URL}/salvar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(estadoObjeto)
      });

      if (!resposta.ok) {
        throw new Error('Falha ao responder do servidor backend');
      }

      return await resposta.json();
    } catch (erro) {
      console.error('Erro ao salvar no repositório remoto/MySQL:', erro);
      return { sucesso: false, erro: erro.message };
    }
  },

  /**
   * Recupera o estado salvo no MySQL através de uma requisição GET
   * @returns {Object|null}
   */
  async carregarEstado() {
    try {
      const resposta = await fetch(`${API_URL}/carregar`);
      if (!resposta.ok) return null;
      
      const dados = await resposta.json();
      return dados;
    } catch (erro) {
      console.error('Erro ao carregar do repositório remoto/MySQL:', erro);
      return null;
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = { banco };
}