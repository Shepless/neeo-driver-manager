const express = require('express');
const cors = require('cors');
const DriverController = require('../controllers/driver');
const app = express();

module.exports = {
  init() {
    this.configureMiddleware();
    this.configureControllers();
  },

  configureMiddleware() {
    app.use(cors());
    app.use(express.static('public'));
    app.use(express.json());
  },

  configureControllers() {
    app.get('/drivers', (req, res) => DriverController.getAll(req, res));
    app.post('/drivers', (req, res) => DriverController.install(req, res));
    app.put('/drivers', (req, res) => DriverController.update(req, res));
    app.delete('/drivers', (req, res) => DriverController.delete(req, res));
    app.get('/drivers/:query', (req, res) => DriverController.search(req, res));
  },

  start(port) {
    port = port || 3000;
    app.listen(port, () => console.log(`Neeo Driver Manager running on port ${port}`));
  }
}
