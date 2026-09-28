const db = require('../config/database');

const formaPagamentoRepository = {
    // Lista todas as formas de pagamento/transferência disponíveis
    async listarTodas() {
        const sql = `SELECT * FROM formas_pagamento ORDER BY nome ASC;`;
        const [linhas] = await db.execute(sql);
        return linhas;
    }
};

module.exports = formaPagamentoRepository;
