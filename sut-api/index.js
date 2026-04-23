const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API çalışıyor 🚀');
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});