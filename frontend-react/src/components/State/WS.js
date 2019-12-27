// with ES6 import
import io from 'socket.io-client';

const socket = io('/', {
  upgrade: false,
  transports: ['websocket'],
});

socket.on('connect', function() {
  console.log('🚀 Websocket connected');
});

export default socket;
