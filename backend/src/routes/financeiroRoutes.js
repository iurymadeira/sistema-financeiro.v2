const express = require('express');
const router = express.Router();
const financeiroController = require('../controllers/financeiroController');
const transacaoController = require('../controllers/transacaoController');

// --- Rotas de Projeção (existentes) ---
router.post('/calcular', financeiroController.calcularEProjetar);
router.get('/carregar', financeiroController.carregarConfiguracao);

// --- Rotas de Transações ---
router.post('/transacoes', transacaoController.criar);                            // Cadastrar nova movimentação
router.get('/transacoes/usuario/:usuarioId', transacaoController.listar);        // Listar por usuário
router.delete('/transacoes/:id/usuario/:usuarioId', transacaoController.deletar); // Deletar movimentação

// --- Rotas de Exceções de Recorrência ---
router.post('/excecoes', transacaoController.criarExcecao);                      // Registrar exceção numa parcela

module.exports = router;
