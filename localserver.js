const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()

/**
 * DEV SERVER FOR LOCALHOST TESTING ONLY
 * May differ from published amplify backend
 * `amplify mock function` does not run continuously
 * 
 * add LOCAL to environment variables
 */

if (process.env.REACT_APP_LOCAL === 'true') {

  const LOCALPORT = process.env.LOCALPORT || 8080;
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  app.get('/mbgf', function (req, res) {
    res.json({ tkn: process.env.MBTKN, style: process.env.MBSTL });
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

  app.listen(LOCALPORT, () => {
    console.log(`running at port:${LOCALPORT}`);
  });

}