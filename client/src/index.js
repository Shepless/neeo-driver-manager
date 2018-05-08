import './reset.css';
import React from 'react';
import ReactDOM from 'react-dom';
import socketIo from 'socket.io-client';
import axios from 'axios';
import DriverStore from '@/state/stores/driver';
import DriverModel from '@/state/models/driver';
import App from '@/app/app';

axios.get('/api/drivers').then((response) => {
  const socket = socketIo('http://localhost:3000');
  const store = new DriverStore();

  store.drivers = response.data.map((data) => new DriverModel(
    data.name,
    data.description,
    data.status,
    data.cpu,
    data.memory,
    data.uptime
  ));

  socket.on('driver:update', (drivers) => {
    store.drivers = drivers.map(driver => new DriverModel(
      driver.name,
      driver.description,
      driver.status,
      driver.cpu,
      driver.memory,
      driver.uptime
    ));

    // drivers.forEach((updatedDriver) => {
    //   const driver = store.drivers.find((driver) => driver.name === updatedDriver.name);
    //
    //   if (!driver) {
    //     store.drivers.unshift(new DriverModel(
    //       updatedDriver.name,
    //       updatedDriver.description,
    //       updatedDriver.status,
    //       updatedDriver.cpu,
    //       updatedDriver.memory,
    //       updatedDriver.uptime
    //     ));
    //   } else {
    //     driver.status = updatedDriver.status;
    //     driver.cpu = updatedDriver.cpu;
    //     driver.memory = updatedDriver.memory;
    //     driver.uptime = updatedDriver.uptime;
    //   }
    // });
  });

  ReactDOM.render(<App store={store} />, document.getElementById('app'));
});
