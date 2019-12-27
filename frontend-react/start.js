require('dotenv').config({ silent: true });

const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

const { REACT_APP_API_KEY } = process.env;
const config = { REACT_APP_API_KEY };

const indexPath = path.join(__dirname, 'build', 'index.html');
const original = fs.readFileSync(indexPath, 'utf8');
const replaced = original.replace('window.env={}', `window.env=${JSON.stringify(config)}`);
fs.writeFileSync(indexPath, replaced, 'utf8');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/z/health', function(req, res) {
  res.send('ok');
});

app.get('*', function(req, res) {
  res.sendFile(indexPath);
});

app.listen(3000, function() {
  console.log(`🚀 Frontend Server ready on 3000`);
});
