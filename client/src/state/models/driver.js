import { observable } from 'mobx'

export default class DriverModel {
    @observable name = '';
    @observable description = '';
    @observable status = '';
    @observable cpu = 0;
    @observable memory = 0;
    @observable uptime = 0;

    constructor(name, description, status, cpu, memory, uptime) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.cpu = cpu;
        this.memory = memory;
        this.uptime = uptime;
    }
}
