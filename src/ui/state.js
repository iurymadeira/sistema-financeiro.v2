// --- CAMADA DE ESTADO (Fonte única da verdade) ---
const estado = {
  saldoInicial: 0,
  gastosFixos: 0,
  receitasFixas: 0,
  anos: 1,
  transacoesVariaveis: [], // Pronto para novos recursos do futuro
  projecaoAtual: null
};

// Atualiza o estado a partir dos campos da tela
function atualizarEstado() {
  estado.saldoInicial = parseFloat(document.getElementById('saldo').value) || 0;
  estado.gastosFixos = parseFloat(document.getElementById('gastos').value) || 0;
  estado.receitasFixas = parseFloat(document.getElementById('receitas').value) || 0;
  estado.anos = parseInt(document.getElementById('anos').value) || 1;
}