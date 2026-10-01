const express = require('express');
const cors = require('cors');
require('dotenv').config();

const financeiroRoutes = require('./routes/financeiroRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', financeiroRoutes);

app.listen(PORT, () => {
  console.log(`Servidor Backend rodando em http://localhost:${PORT}`);
});
