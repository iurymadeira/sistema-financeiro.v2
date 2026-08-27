const { calcularProjecao } = require('../src/core/regras.js');

console.log('--- EXECUTANDO TESTES UNITÁRIOS ---');

// Teste 1: Padrão (1 ano)
const resultado1Ano = calcularProjecao(1000, 500, 2000, 1);
const anoAtual = new Date().getFullYear();

// Valida saldo do 1º mês
const primeiroMes = resultado1Ano[anoAtual][0];
if (primeiroMes.saldo === '2500.00') {
  console.log('✅ TESTE 1 PASSOU: Cálculo do saldo do 1º mês correto (R$ 2500.00).');
} else {
  console.error(`❌ TESTE 1 FALHOU: Esperava 2500.00, recebeu ${primeiroMes.saldo}`);
}

// Valida se gerou 12 meses no total
const totalMesesRetornados = Object.values(resultado1Ano)
  .reduce((total, mesesDoAno) => total + mesesDoAno.length, 0);

if (totalMesesRetornados === 12) {
  console.log('✅ TESTE 2 PASSOU: Projeção gerou exatamente 12 meses.');
} else {
  console.error(`❌ TESTE 2 FALHOU: Esperava 12 meses, recebeu ${totalMesesRetornados}`);
}

// Teste 3: Injeção de Data (Simula virada de ano em 31/12/2026)
const dataFicticia = new Date(2026, 11, 31); 
const resultadoVirada = calcularProjecao(1000, 500, 2000, 1, dataFicticia);

if (resultadoVirada[2026] && resultadoVirada[2026][0].mes === 'Dezembro') {
  console.log('✅ TESTE 3 PASSOU: Injeção de data customizada funcionou corretamente.');
} else {
  console.error('❌ TESTE 3 FALHOU: Injeção de data não respondeu como esperado.');
}