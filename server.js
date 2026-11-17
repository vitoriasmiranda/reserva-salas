require('dotenv').config();

const express = require('express');
const cors = require('cors');
const salasRoutes = require('./routes/salasRoutes');
const reservasRoutes = require('./routes/reservasRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/hello', (req, res) => {
  res.json({ mensagem: 'Olá! A API de reserva de salas está no ar.' });
});

app.use('/salas', salasRoutes);
app.use('/reservas', reservasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});