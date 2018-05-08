const pm2 = require('pm2');

class Driver {
  constructor(packageJson) {
    this.name = packageJson.name;
    this.description = packageJson.description;
    this.main = packageJson.main;
    this.pid = 'N/A';
    this.status = 'offline';
    this.cpu = 0;
    this.memory = 0;
    this.uptime = 0;
  }

  connectToDaemon() {
    return new Promise((resolve, reject) => {
      pm2.connect((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  start() {
    return this.connectToDaemon().then(() => {
      return new Promise((resolve, reject) => {
        pm2.start({
          name: this.name,
          script: this.main,
          instances: 1,
          max_memory_restart: '100M'
        }, (error) => {
          if (error) {
            reject(error);
            return
          }

          resolve(this);
        });
      });
    });
  }

  stop() {
    return new Promise ((resolve, reject) => {
      pm2.stop(this.name, (error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  delete() {
    return new Promise((resolve, reject) => {
      pm2.delete(this.name, (error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  update(pid, status, cpu, memory, uptime) {
    this.pid = pid;
    this.status = status;
    this.cpu = cpu;
    this.memory = memory;
    this.uptime = (this.status !== 'online') ? 0 : uptime;
  }
}

module.exports = Driver;
