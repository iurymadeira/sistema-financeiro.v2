// --- CAMADA DE ESTADO (Fonte única da verdade) ---
const estado = {
  usuarioId: 1, // Usuário padrão por enquanto (antes de implementar login)
  saldoInicial: 0,
  anos: 1,
  transacoes: [],       // Transações reais carregadas do banco
  projecaoAtual: null,
  metricasAtuais: null
};

function definirEstado(novosDados) {
  Object.assign(estado, novosDados);
}

// Para uso no Node/Testes se necessário
if (typeof module !== 'undefined') {
  module.exports = { estado, definirEstado };
}