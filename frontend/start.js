const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/z/health', function(req, res) {
  res.send('ok');
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000, function() {
  console.log(`🚀 Frontend Server ready on 3000`);
});
