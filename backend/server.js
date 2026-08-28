const express = require('express');
const cors = require('cors');
require('dotenv').config();

const financeiroController = require('./src/controllers/financeiroController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas delegadas para a camada de Controller
app.post('/api/salvar', financeiroController.salvarConfiguracao);
app.get('/api/carregar', financeiroController.carregarConfiguracao);

// Inicialização
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend rodando em http://localhost:${PORT}`);
});