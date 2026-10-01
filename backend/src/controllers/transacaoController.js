const transacaoRepository = require('../repositories/transacaoRepository');
const excecaoRepository = require('../repositories/excecaoRepository');

// Cadastra uma nova movimentação (pontual ou recorrente)
exports.criar = async (req, res) => {
  try {
    const {
      usuarioId, categoriaId, formaPagamentoId,
      descricao, valor, tipo, dataTransacao,
      recorrente, intervalo, dataFim
    } = req.body;

    if (!usuarioId || !categoriaId || !valor || !tipo || !dataTransacao) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Campos obrigatórios: usuarioId, categoriaId, valor, tipo, dataTransacao.'
      });
    }

    const id = await transacaoRepository.criar({
      usuarioId, categoriaId, formaPagamentoId,
      descricao, valor, tipo, dataTransacao,
      recorrente: recorrente || false,
      intervalo: intervalo || 1,
      dataFim: dataFim || null
    });

    res.status(201).json({ sucesso: true, id });
  } catch (erro) {
    console.error('Erro ao criar transação:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao criar transação.' });
  }
};

// Lista todas as movimentações de um usuário
exports.listar = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ sucesso: false, erro: 'usuarioId é obrigatório.' });
    }

    const transacoes = await transacaoRepository.buscarPorUsuario(usuarioId);
    res.json({ sucesso: true, transacoes });
  } catch (erro) {
    console.error('Erro ao listar transações:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao listar transações.' });
  }
};

// Deleta uma movimentação
exports.deletar = async (req, res) => {
  try {
    const { id, usuarioId } = req.params;

    const deletado = await transacaoRepository.deletar(id, usuarioId);

    if (!deletado) {
      return res.status(404).json({ sucesso: false, erro: 'Transação não encontrada.' });
    }

    res.json({ sucesso: true, mensagem: 'Transação removida com sucesso.' });
  } catch (erro) {
    console.error('Erro ao deletar transação:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao deletar transação.' });
  }
};

// Registra uma exceção em uma parcela específica de uma recorrência
exports.criarExcecao = async (req, res) => {
  try {
    const { transacaoPaiId, dataOriginal, novaData, novoValor, cancelado } = req.body;

    if (!transacaoPaiId || !dataOriginal) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Campos obrigatórios: transacaoPaiId, dataOriginal.'
      });
    }

    const id = await excecaoRepository.criar({
      transacaoPaiId, dataOriginal, novaData, novoValor,
      cancelado: cancelado || false
    });

    res.status(201).json({ sucesso: true, id });
  } catch (erro) {
    console.error('Erro ao criar exceção:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno ao criar exceção.' });
  }
};
