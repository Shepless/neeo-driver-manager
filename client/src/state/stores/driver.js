import {observable, computed} from 'mobx';

export default class DriverStore {
  @observable drivers = [];
  
  @observable filter = '';

  @computed get visibleDrivers() {
    switch (this.filter) {
      case 'online':
        return this.drivers.filter(driver => driver.status === 'online');
      case 'stopped':
        return this.drivers.filter(driver => driver.status === 'stopped');
      case 'errored':
        return this.drivers.filter(driver => driver.status === 'errored');
      default:
        return this.drivers;
    }
  }
}
