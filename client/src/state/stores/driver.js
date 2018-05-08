import { observable } from 'mobx';
import DriverModel from '../models/driver';

export default class DriverStore {
    @observable drivers = [];
}
