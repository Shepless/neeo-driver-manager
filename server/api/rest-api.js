const http = require('http');
const express = require('express');
const socketIo = require("socket.io");
const cors = require('cors');
const DriverController = require('../controllers/driver');
const app = express();

module.exports = {
  init() {
    this.server = http.createServer(app);
    this.configureMiddleware();
    this.configureControllers();
  },

  configureMiddleware() {
    app.use(cors());
    app.use(express.static('public'));
    app.use(express.json());
  },

  configureControllers() {
    app.get('/api/drivers', (req, res) => DriverController.getAll(req, res));
    app.post('/api/drivers', (req, res) => DriverController.install(req, res));
    app.put('/api/drivers', (req, res) => DriverController.update(req, res));
    app.delete('/api/drivers', (req, res) => DriverController.delete(req, res));
    app.get('/api/drivers/:query', (req, res) => DriverController.search(req, res));
  },

  start(port) {
    port = port || 3000;
    this.server.listen(port, () => console.log(`Neeo Driver Manager running on port ${port}`));
  }
}
