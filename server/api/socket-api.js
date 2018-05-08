const socketIo = require('socket.io');
const DriverManager = require('../services/driver-manager');

module.exports = {
  init(server) {
    this.server = server;
  },

  start(port) {
    this.io = socketIo(this.server);
    this.io.on('connection', (socket) => this.onConnected(socket));
  },

  onConnected(socket) {
    DriverManager.on('update', drivers => socket.emit('driver:update', drivers));
  }
}
