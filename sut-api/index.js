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

app.post('/sync/events', (req, res) => {
  const events = Array.isArray(req.body?.events) ? req.body.events : [];
  res.status(200).json({
    accepted: events.length,
    receivedAt: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});