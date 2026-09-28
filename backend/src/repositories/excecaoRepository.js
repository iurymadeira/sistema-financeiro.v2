const db = require('../config/database');

const excecaoRepository = {
    // Registra uma alteração de valor/data ou cancelamento para um mês específico de uma recorrência
    async criar(dados) {
        const sql = `
      INSERT INTO transacao_excecoes (
        transacao_pai_id, data_original, nova_data, novo_valor, cancelado
      ) VALUES (?, ?, ?, ?, ?);
    `;
        const [resultado] = await db.execute(sql, [
            dados.transacaoPaiId,
            dados.dataOriginal,
            dados.novaData || null,
            dados.novoValor !== undefined ? dados.novoValor : null,
            dados.cancelado ? 1 : 0
        ]);
        return resultado.insertId;
    },

    // Busca todas as exceções de uma transação recorrente
    async buscarPorTransacaoPai(transacaoPaiId) {
        const sql = `SELECT * FROM transacao_excecoes WHERE transacao_pai_id = ?;`;
        const [linhas] = await db.execute(sql, [transacaoPaiId]);
        return linhas;
    }
};

module.exports = excecaoRepository;
