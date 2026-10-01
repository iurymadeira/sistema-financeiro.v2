const db = require('../config/database');
const calculoService = require('../services/calculoService');
const transacaoRepository = require('../repositories/transacaoRepository');
const excecaoRepository = require('../repositories/excecaoRepository');

exports.calcularEProjetar = async (req, res) => {
  try {
    const { usuarioId, saldoInicial, anos } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ sucesso: false, erro: 'usuarioId é obrigatório.' });
    }

    // 1. Busca todas as transações do usuário no banco
    const transacoes = await transacaoRepository.buscarPorUsuario(usuarioId);

    // 2. Busca todas as exceções de cada transação recorrente
    const excecoes = [];
    for (const t of transacoes) {
      if (t.recorrente) {
        const excs = await excecaoRepository.buscarPorTransacaoPai(t.id);
        excecoes.push(...excs);
      }
    }

    // 3. Calcula a projeção com os dados reais do banco
    const projecao = calculoService.calcularProjecao(
      parseFloat(saldoInicial) || 0,
      transacoes,
      excecoes,
      parseInt(anos) || 1
    );

    const metricas = calculoService.obterMetricasProjecao(projecao);

    // 4. Persiste o saldo inicial e o período escolhidos pelo usuário
    const sql = `
      INSERT INTO configuracao_financeira (id, saldo_inicial, gastos_fixos, receitas_fixas, anos_projecao)
      VALUES (1, ?, 0, 0, ?)
      ON DUPLICATE KEY UPDATE
        saldo_inicial = VALUES(saldo_inicial),
        anos_projecao = VALUES(anos_projecao);
    `;
    await db.execute(sql, [saldoInicial, anos]);

    // 5. Retorna projeção e métricas para a tela
    res.json({ sucesso: true, projecao, metricas });

  } catch (erro) {
    console.error('Erro ao calcular projeção no Backend:', erro);
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
};

exports.carregarConfiguracao = async (req, res) => {
  try {
    const [linhas] = await db.execute('SELECT * FROM configuracao_financeira WHERE id = 1');

    if (linhas.length === 0) return res.json(null);

    const dado = linhas[0];
    res.json({
      saldoInicial: parseFloat(dado.saldo_inicial),
      gastosFixos: parseFloat(dado.gastos_fixos),
      receitasFixas: parseFloat(dado.receitas_fixas),
      anos: parseInt(dado.anos_projecao)
    });
  } catch (erro) {
    console.error('Erro ao carregar do MySQL:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao consultar o banco.' });
  }
};