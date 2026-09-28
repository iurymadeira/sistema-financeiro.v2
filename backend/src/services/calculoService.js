// backend/src/services/calculoService.js

/**
 * Extrai ano, mês (0-11) e dia sem distorção de fuso horário
 */
function extrairAnoMes(dataInput) {
  if (typeof dataInput === 'string') {
    const partes = dataInput.split('T')[0].split('-');
    if (partes.length >= 2) {
      return { ano: parseInt(partes[0], 10), mes: parseInt(partes[1], 10) - 1 };
    }
  }
  const d = new Date(dataInput);
  return { ano: d.getFullYear(), mes: d.getMonth() };
}

/**
 * Auxiliar para comparar se duas datas pertencem ao mesmo mês e ano
 */
function mesmoMesEAno(d1, d2) {
  const info1 = extrairAnoMes(d1);
  const info2 = extrairAnoMes(d2);
  return info1.ano === info2.ano && info1.mes === info2.mes;
}

/**
 * Calcula o impacto financeiro de um mês/ano específico com base nas transações e exceções registradas
 */
function calcularImpactoMes(transacoes, excecoesMap, dataMesAtual) {
  let receitas = 0;
  let despesas = 0;

  if (!Array.isArray(transacoes)) return { receitas: 0, despesas: 0, variacaoLiquida: 0 };

  const anoMesAtual = extrairAnoMes(dataMesAtual);

  for (const t of transacoes) {
    const infoTransacao = extrairAnoMes(t.data_transacao);
    const infoFim = t.data_fim ? extrairAnoMes(t.data_fim) : null;

    let aplicaNesteMes = false;

    if (!t.recorrente) {
      // Transação pontual/momentânea
      aplicaNesteMes = infoTransacao.ano === anoMesAtual.ano && infoTransacao.mes === anoMesAtual.mes;
    } else {
      // Transação recorrente
      const iniciou = (anoMesAtual.ano > infoTransacao.ano) || 
                      (anoMesAtual.ano === infoTransacao.ano && anoMesAtual.mes >= infoTransacao.mes);
                      
      const dentroDoFim = !infoFim || 
                          (anoMesAtual.ano < infoFim.ano) || 
                          (anoMesAtual.ano === infoFim.ano && anoMesAtual.mes <= infoFim.mes);

      if (iniciou && dentroDoFim) {
        const mesesDiferenca = (anoMesAtual.ano - infoTransacao.ano) * 12 + (anoMesAtual.mes - infoTransacao.mes);
        const intervalo = parseInt(t.intervalo) || 1;
        aplicaNesteMes = mesesDiferenca >= 0 && (mesesDiferenca % intervalo === 0);
      }
    }

    if (!aplicaNesteMes) continue;

    // Chave única para verificar se existe exceção para esta transação neste mês/ano
    const chaveExcecao = `${t.id}_${anoMesAtual.ano}_${anoMesAtual.mes}`;
    const excecao = excecoesMap[chaveExcecao];

    // Se houver uma exceção cancelando o mês, ignora
    if (excecao && excecao.cancelado) {
      continue;
    }

    // Se houver alteração de valor na exceção, utiliza o novo valor; senão usa o valor original
    let valorFinal = (excecao && excecao.novo_valor !== null && excecao.novo_valor !== undefined)
      ? parseFloat(excecao.novo_valor)
      : parseFloat(t.valor);

    if (isNaN(valorFinal)) valorFinal = 0;

    const tipo = (t.tipo || '').toUpperCase();
    if (tipo === 'RECEITA') {
      receitas += valorFinal;
    } else if (tipo === 'DESPESA') {
      despesas += valorFinal;
    }
  }

  return { receitas, despesas, variacaoLiquida: receitas - despesas };
}


/**
 * Calcula a projeção financeira mês a mês ao longo dos anos parametrizados
 */
function calcularProjecao(saldoInicial, transacoes = [], excecoes = [], anos = 1, dataReferencia = new Date()) {
  let mesAtual = dataReferencia.getMonth();
  let anoAtual = dataReferencia.getFullYear();
  const mesesDoAno = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const parsedSaldo = parseFloat(saldoInicial) || 0;
  const parsedAnos = parseInt(anos) || 1;

  if (isNaN(parsedSaldo) || parsedSaldo < 0) {
    throw new Error("O saldo inicial deve ser um número válido e maior ou igual a zero.");
  }
  if (isNaN(parsedAnos) || parsedAnos < 1 || parsedAnos > 30) {
    throw new Error("O tempo de projeção deve ser entre 1 e 30 anos.");
  }

  // Mapeia exceções para acesso rápido O(1)
  const excecoesMap = {};
  if (Array.isArray(excecoes)) {
    for (const exc of excecoes) {
      const info = extrairAnoMes(exc.data_original);
      const chave = `${exc.transacao_pai_id}_${info.ano}_${info.mes}`;
      excecoesMap[chave] = exc;
    }
  }

  let saldoAcumulado = parsedSaldo;
  const projecaoPorAno = {};
  const totalDeMeses = parsedAnos * 12;

  for (let i = 0; i < totalDeMeses; i++) {
    const dataMesAtual = new Date(anoAtual, mesAtual, 1);
    const impacto = calcularImpactoMes(transacoes, excecoesMap, dataMesAtual);

    saldoAcumulado += impacto.variacaoLiquida;

    if (!projecaoPorAno[anoAtual]) {
      projecaoPorAno[anoAtual] = [];
    }

    projecaoPorAno[anoAtual].push({
      mes: mesesDoAno[mesAtual],
      mesIndice: mesAtual,
      ano: anoAtual,
      saldo: parseFloat(saldoAcumulado.toFixed(2)),
      gastosDoMes: parseFloat(impacto.despesas.toFixed(2)),
      receitasDoMes: parseFloat(impacto.receitas.toFixed(2)),
      variacaoDoMes: parseFloat(impacto.variacaoLiquida.toFixed(2))
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
 * Extrai estatísticas e métricas de resumo da projeção
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
      somaVariacoesMensais += item.variacaoDoMes;
    });
  });

  return {
    menorSaldo: menorSaldo.saldo === Infinity ? { saldo: 0, mes: '', ano: null } : menorSaldo,
    maiorSaldo: maiorSaldo.saldo === -Infinity ? { saldo: 0, mes: '', ano: null } : maiorSaldo,
    economiaMediaMensal: totalMeses > 0 ? parseFloat((somaVariacoesMensais / totalMeses).toFixed(2)) : 0,
    totalMesesAnalisados: totalMeses
  };
}

module.exports = {
  calcularProjecao,
  obterMetricasProjecao,
  calcularImpactoMes
};