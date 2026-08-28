// --- CAMADA DE ESTADO (Fonte única da verdade) ---
const estado = {
  saldoInicial: 0,
  gastosFixos: 0,
  receitasFixas: 0,
  anos: 1,
  transacoesVariaveis: [],
  projecaoAtual: null
};

function definirEstado(novosDados) {
  Object.assign(estado, novosDados);
}

// Para uso no Node/Testes se necessário
if (typeof module !== 'undefined') {
  module.exports = { estado, definirEstado };
}