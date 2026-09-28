const db = require('../config/database');

const transacaoRepository = {
    // Cadastra uma nova movimentação (pontual ou pai de recorrência)
    async criar(dados) {
        const sql = `
      INSERT INTO transacoes (
        usuario_id, categoria_id, forma_pagamento_id, descricao,
        valor, tipo, data_transacao, recorrente, intervalo, data_fim
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
        const [resultado] = await db.execute(sql, [
            dados.usuarioId,
            dados.categoriaId,
            dados.formaPagamentoId || null,
            dados.descricao || null,
            dados.valor,
            dados.tipo,
            dados.dataTransacao,
            dados.recorrente ? 1 : 0,
            dados.intervalo || 1,
            dados.dataFim || null
        ]);
        return resultado.insertId;
    },

    // Busca todas as movimentações do usuário trazidas com nome da Categoria e Forma de Pagamento
    async buscarPorUsuario(usuarioId) {
        const sql = `
      SELECT 
        t.*,
        c.nome AS categoria_nome,
        c.icone AS categoria_icone,
        fp.nome AS forma_pagamento_nome
      FROM transacoes t
      JOIN categorias c ON t.categoria_id = c.id
      LEFT JOIN formas_pagamento fp ON t.forma_pagamento_id = fp.id
      WHERE t.usuario_id = ?
      ORDER BY t.data_transacao ASC;
    `;
        const [linhas] = await db.execute(sql, [usuarioId]);
        return linhas;
    },

    // Deleta uma transação específica
    async deletar(id, usuarioId) {
        const sql = `DELETE FROM transacoes WHERE id = ? AND usuario_id = ?;`;
        const [resultado] = await db.execute(sql, [id, usuarioId]);
        return resultado.affectedRows > 0;
    }
};

module.exports = transacaoRepository;
