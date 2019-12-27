const config = require('./config');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wildcard = require('socketio-wildcard')();
const redisAdapter = require('socket.io-redis');
const bodyParser = require('body-parser');
const createRedis = require('./redis');
const pubClient = createRedis('pubClient');
const subClient = createRedis('subClient');

io.use(wildcard);
io.adapter(redisAdapter({ pubClient, subClient }));

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

io.on('connection', function(socket) {
  socket.on('*', function({ data }) {
    const [channel, { masterId, ...payload }] = data;

    io.emit(`${masterId}:${channel}`, payload);
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
