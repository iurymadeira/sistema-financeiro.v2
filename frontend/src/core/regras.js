// --- CAMADA DE NEGÓCIO (Regras puras do sistema) ---
function calcularProjecao(saldoInicial, gastosFixos, receitasFixas, anos, dataReferencia = new Date()) {
  let mesAtual = dataReferencia.getMonth();
  let anoAtual = dataReferencia.getFullYear();
  const mesesDoAno = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (isNaN(saldoInicial) || saldoInicial < 0) {
    throw new Error("O saldo inicial deve ser um número válido e maior ou igual a zero.");
  }
  if (isNaN(gastosFixos) || gastosFixos < 0 || isNaN(receitasFixas) || receitasFixas < 0) {
    throw new Error("Os valores de gastos e receitas devem ser números válidos.");
  }
  if (isNaN(anos) || anos < 1 || anos > 30) {
    throw new Error("O tempo de projeção deve ser entre 1 e 30 anos.");
  }

  let saldoAcumulado = saldoInicial;
  const projecaoPorAno = {};
  const totalDeMeses = anos * 12;

  for (let i = 1; i <= totalDeMeses; i++) {
    saldoAcumulado = saldoAcumulado + receitasFixas - gastosFixos;
    const nomeMes = mesesDoAno[mesAtual];

    if (!projecaoPorAno[anoAtual]) {
      projecaoPorAno[anoAtual] = [];
    }

    projecaoPorAno[anoAtual].push({
      mes: nomeMes,
      saldo: saldoAcumulado.toFixed(2)
    });

    mesAtual++;
    if (mesAtual > 11) {
      mesAtual = 0;
      anoAtual++;
    }
  }

  return projecaoPorAno;
}

if (typeof module !== 'undefined') {
  module.exports = { calcularProjecao };
}