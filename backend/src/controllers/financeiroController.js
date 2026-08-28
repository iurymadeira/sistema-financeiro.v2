const db = require('../config/database');

exports.salvarConfiguracao = async (req, res) => {
  try {
    const { saldoInicial, gastosFixos, receitasFixas, anos } = req.body;

    // Validação de Segurança e Regra de Negócio na API
    if (isNaN(saldoInicial) || saldoInicial < 0 ||
        isNaN(gastosFixos) || gastosFixos < 0 ||
        isNaN(receitasFixas) || receitasFixas < 0 ||
        isNaN(anos) || anos < 1 || anos > 30) {
      return res.status(400).json({ sucesso: false, erro: 'Dados de entrada inválidos.' });
    }

    const sql = `
      INSERT INTO configuracao_financeira (id, saldo_inicial, gastos_fixos, receitas_fixas, anos_projecao)
      VALUES (1, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        saldo_inicial = VALUES(saldo_inicial),
        gastos_fixos = VALUES(gastos_fixos),
        receitas_fixas = VALUES(receitas_fixas),
        anos_projecao = VALUES(anos_projecao);
    `;

    await db.execute(sql, [saldoInicial, gastosFixos, receitasFixas, anos]);

    res.json({ sucesso: true, mensagem: 'Dados gravados no MySQL com sucesso!' });
  } catch (erro) {
    console.error('Erro ao salvar no MySQL:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao salvar no banco.' });
  }
};

exports.carregarConfiguracao = async (req, res) => {
  try {
    const [linhas] = await db.execute('SELECT * FROM configuracao_financeira WHERE id = 1');

    if (linhas.length === 0) {
      return res.json(null);
    }

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