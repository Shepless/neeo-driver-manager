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
          return reject(error);
        }

        resolve();
      });
    });
  }

  start() {
    this.status = 'launching';

    return this.connectToDaemon().then(() => {
      new Promise((resolve, reject) => {
        pm2.start({
          name: this.name,
          script: this.main,
          instances: 1,
          max_memory_restart: '100M',
          min_uptime: '2500',
          restart_delay: 2000,
          max_restarts: 3
        }, (error) => {
          if (error) {
            return reject(error);
          }

          resolve(this);
        });
      });
    });
  }

  stop() {
    this.status = 'stopping';

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
    this.status = 'deleting';

    return new Promise((resolve, reject) => {
      pm2.delete(this.name, (error) => {
        if (error) {
          this.status = 'offline';
          return reject(error);
        }

        this.status = 'deleted';
        resolve();
      });
    });
  }

  getProcess() {
    return new Promise((resolve, reject) => {
      pm2.list((error, processes) => {
        if (error) {
          return reject(this);
        }

        resolve(processes.find((process) => process.name === this.name));
      });
    });
  }

  update() {
    return this.getProcess()
      .then((process) => {
        this.pid = process.pid;
        this.status = process.pm2_env.status;
        this.cpu = process.monit.cpu + '%';
        this.memory = (process.monit.memory / 1000000).toFixed(0) + 'MB';
        this.uptime = ((this.status === 'online') ?
              ((Date.now() - process.pm2_env.created_at) / 1000).toFixed(0) :
              0) + 's';
      })
      .catch(() => this);
  }
}

module.exports = Driver;
