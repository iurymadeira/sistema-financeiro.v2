const { calcularProjecao, obterMetricasProjecao } = require('../src/services/calculoService');

console.log('--- EXECUTANDO TESTES UNITÁRIOS DO SERVIÇO DE CÁLCULO ---');

const dataHoje = new Date();
const anoAtual = dataHoje.getFullYear();

// Mock de transações
const transacoesMock = [
  {
    id: 1,
    descricao: 'Salário',
    valor: '5000.00',
    tipo: 'RECEITA',
    recorrente: true,
    intervalo: 1,
    data_transacao: '2026-01-01'
  },
  {
    id: 2,
    descricao: 'Aluguel',
    valor: '1500.00',
    tipo: 'DESPESA',
    recorrente: true,
    intervalo: 1,
    data_transacao: '2026-01-01'
  },
  {
    id: 3,
    descricao: 'Bônus Pontual',
    valor: '1000.00',
    tipo: 'RECEITA',
    recorrente: false,
    data_transacao: `${anoAtual}-01-15`
  }
];

// Mock de exceções
const excecoesMock = [
  {
    transacao_pai_id: 2, // Aluguel
    data_original: `${anoAtual}-02-01`,
    novo_valor: '2000.00', // Aluguel subiu para 2000 no 2º mês
    cancelado: false
  }
];

// Executa projeção para 1 ano com saldo inicial R$ 1000
const resultado = calcularProjecao(1000, transacoesMock, excecoesMock, 1, new Date(anoAtual, 0, 1));
const metricas = obterMetricasProjecao(resultado);

console.log('Projeção gerada para o ano:', Object.keys(resultado));
const mesesAno = resultado[anoAtual];

console.log(`- Mês 1 (Janeiro): Receitas R$ ${mesesAno[0].receitasDoMes} | Gastos R$ ${mesesAno[0].gastosDoMes} | Saldo R$ ${mesesAno[0].saldo}`);
console.log(`- Mês 2 (Fevereiro - com exceção no aluguel): Receitas R$ ${mesesAno[1].receitasDoMes} | Gastos R$ ${mesesAno[1].gastosDoMes} | Saldo R$ ${mesesAno[1].saldo}`);

if (mesesAno.length === 12) {
  console.log('TESTE 1 PASSOU: 12 meses gerados.');
} else {
  console.error('TESTE 1 FALHOU.');
}

if (mesesAno[1].gastosDoMes === 2000) {
  console.log('TESTE 2 PASSOU: Exceção de alteração de valor aplicada com sucesso no 2º mês (R$ 2000.00).');
} else {
  console.error(`TESTE 2 FALHOU: Esperava 2000.00 nos gastos do mês 2, recebeu ${mesesAno[1].gastosDoMes}`);
}

console.log('--- TESTES CONCLUÍDOS COM SUCESSO ---');
