// backend/src/services/calculoService.js

/**
 * Validador de Escopo Temporal (Ciclo de Vida)
 */
function processarRecorrencia(regra, mesDecorrido) {
  if (typeof regra === 'number') return regra;
  if (Array.isArray(regra)) {
    return regra.reduce((total, item) => {
      const dentroDoPrazo = !item.duracaoMeses || mesDecorrido <= item.duracaoMeses;
      return dentroDoPrazo ? total + (item.valor || 0) : total;
    }, 0);
  }
  return 0;
}

/**
 * Sumariza transações pontuais para um mês/ano específico
 */
function calcularImpactoVariavel(transacoes, mes, ano) {
  if (!Array.isArray(transacoes)) return 0;
  return transacoes
    .filter(t => t.mes === mes && t.ano === ano)
    .reduce((total, t) => {
      const valor = parseFloat(t.valor) || 0;
      return t.tipo === 'despesa' ? total - valor : total + valor;
    }, 0);
}

/**
 * Calcula a projeção financeira
 */
function calcularProjecao(saldoInicial, gastosFixos, receitasFixas, anos, transacoesVariaveis = [], dataReferencia = new Date()) {
  let mesAtual = dataReferencia.getMonth();
  let anoAtual = dataReferencia.getFullYear();
  const mesesDoAno = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (isNaN(saldoInicial) || saldoInicial < 0) {
    throw new Error("O saldo inicial deve ser um número válido e maior ou igual a zero.");
  }
  if (isNaN(anos) || anos < 1 || anos > 30) {
    throw new Error("O tempo de projeção deve ser entre 1 e 30 anos.");
  }

  let saldoAcumulado = saldoInicial;
  const projecaoPorAno = {};
  const totalDeMeses = anos * 12;

  for (let i = 1; i <= totalDeMeses; i++) {
    const valorGastos = processarRecorrencia(gastosFixos, i);
    const valorReceitas = processarRecorrencia(receitasFixas, i);
    const impactoVariavel = calcularImpactoVariavel(transacoesVariaveis, mesAtual, anoAtual);

    saldoAcumulado = saldoAcumulado + valorReceitas - valorGastos + impactoVariavel;

    if (!projecaoPorAno[anoAtual]) {
      projecaoPorAno[anoAtual] = [];
    }

    projecaoPorAno[anoAtual].push({
      mes: mesesDoAno[mesAtual],
      mesIndice: mesAtual,
      ano: anoAtual,
      saldo: parseFloat(saldoAcumulado.toFixed(2)),
      gastosDoMes: valorGastos,
      receitasDoMes: valorReceitas,
      variacaoDoMes: impactoVariavel
    });

    mesAtual++;
    if (mesAtual > 11) {
      mesAtual = 0;
      anoAtual++;
    }
  }

  return projecaoPorAno;
}

/**
 * Extrai resumo de estatísticas da projeção
 */
function obterMetricasProjecao(projecaoPorAno) {
  let menorSaldo = { saldo: Infinity, mes: '', ano: null };
  let maiorSaldo = { saldo: -Infinity, mes: '', ano: null };
  let somaVariacoesMensais = 0;
  let totalMeses = 0;

  Object.keys(projecaoPorAno).forEach(ano => {
    projecaoPorAno[ano].forEach(item => {
      totalMeses++;
      if (item.saldo < menorSaldo.saldo) menorSaldo = { saldo: item.saldo, mes: item.mes, ano: item.ano };
      if (item.saldo > maiorSaldo.saldo) maiorSaldo = { saldo: item.saldo, mes: item.mes, ano: item.ano };
      somaVariacoesMensais += (item.receitasDoMes - item.gastosDoMes) + item.variacaoDoMes;
    });
  });

  return {
    menorSaldo,
    maiorSaldo,
    economiaMediaMensal: totalMeses > 0 ? parseFloat((somaVariacoesMensais / totalMeses).toFixed(2)) : 0,
    totalMesesAnalisados: totalMeses
  };
}

module.exports = {
  calcularProjecao,
  obterMetricasProjecao,
  processarRecorrencia,
  calcularImpactoVariavel
};