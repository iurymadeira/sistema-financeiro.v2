const express = require('express');
const cors = require('cors');
require('dotenv').config();

const financeiroController = require('./src/controllers/financeiroController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.post('/api/calcular', financeiroController.calcularEProjetar);
app.get('/api/carregar', financeiroController.carregarConfiguracao);

app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend rodando em http://localhost:${PORT}`);
});