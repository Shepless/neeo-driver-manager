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
    const onDriversUpdate = drivers => {
      socket.emit('driver:update', drivers);
    };

    DriverManager.on('update', onDriversUpdate);

    socket.on('disconnect', () => {
      DriverManager.removeListener('update', onDriversUpdate);
    });
  }
}
