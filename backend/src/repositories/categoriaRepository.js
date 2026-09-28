const db = require('../config/database');

const categoriaRepository = {
    // Lista categorias globais (usuario_id IS NULL) e personalizadas do usuário
    async listarTodas(usuarioId = null) {
        const sql = `
      SELECT * FROM categorias 
      WHERE usuario_id IS NULL OR usuario_id = ?
      ORDER BY nome ASC;
    `;
        const [linhas] = await db.execute(sql, [usuarioId]);
        return linhas;
    }
};

module.exports = categoriaRepository;
