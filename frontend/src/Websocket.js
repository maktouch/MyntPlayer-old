// with ES6 import
import io from 'socket.io-client';

const socket = io('/');
socket.on('connect', function() {
  console.log('🚀 Websocket connected');
});

export default socket;
