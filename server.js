const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()

const PORT = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
}); 

app.get('/mbgf', function (req, res) {
  res.json({tkn: process.env.MBTKN, style: process.env.MBSTL});
});

app.use((req, res, next) => {
  const err = new Error('page not found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.sendFile(path.join(__dirname, 'build', 'error.html'));
});

app.listen(PORT, () => {
  console.log(`running at port:${PORT}`);
});