const config = require('./config');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const createRedis = require('./redis');

const publisher = createRedis('publisher');
const subscriber = createRedis('subscriber');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.disable('x-powered-by');
app.set('trust proxy', 1);

const start = cb => {
  server.listen(Number(config.PORT), '0.0.0.0', function() {
    console.log(`🚀 Backend Server ready on ${config.PORT}`);

    cb && cb();
  });
};

app.get('/z/health', function(req, res) {
  res.send('ok');
});

app.post('/api/addToQueue', function(req, res) {
  const { video } = req.body;
  res.send({ video });
  publisher.publish('addToQueue', JSON.stringify({ video }));
});

io.on('connection', function(socket) {
  subscriber.subscribe('addToQueue', 'sync');
  subscriber.on('message', function(channel, message) {
    const parsed = JSON.parse(message);
    console.log('received from redis', channel, parsed);
    socket.emit(channel, parsed);
  });

  socket.on('sync', function(queue) {
    console.log('received from ws', queue);
    publisher.publish('sync', JSON.stringify({ queue }));
  });
});

process.on('SIGUSR2', function() {
  process.kill(process.pid, 'SIGKILL');
  server.close(function() {
    process.exit(0);
  });
});

process.on('SIGTERM', function() {
  // shuttingDown = true;
  console.log(`---- SIGTERM Received. Shutting down gracefully`);

  server.close(_ => {
    process.kill(process.pid, 'SIGTERM');
    process.exit(0);
  });
});

start();
