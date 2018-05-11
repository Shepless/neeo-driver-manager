import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import axios from 'axios';
import Dialog from 'react-toolbox/lib/dialog';
import Driver from '@/drivers/driver';

const DRIVER_STYLES = {
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row'
};

@observer
export default class Drivers extends Component {
  @observable isDialogActive = false;
  @observable driverToDelete = false;
  dialogActions = [
    { label: "Yes", onClick: () => this.onDelete() },
    { label: "No", onClick: () => this.toggleDialog() }
  ];

  onTogglePower(driver) {
    axios.put('/api/drivers', {
      name: driver.name,
      action: (driver.status === 'online') ? 'stop' : 'start'
    });
  }

  toggleDialog(driverToDelete) {
    this.isDialogActive = !this.isDialogActive;

    if (driverToDelete) {
      this.driverToDelete = driverToDelete;
    }
  }

  onDelete(driver) {
    this.toggleDialog();

    axios.delete('/api/drivers', {
      params: {
        name: this.driverToDelete.name
      }
    });
  }

  render() {
    return (
      <div style={DRIVER_STYLES}>
        {this.props.drivers.map((driver, index) => (
          <Driver
            key={index}
            driver={driver}
            onTogglePower={(driver) => this.onTogglePower(driver)}
            onDelete={(driver) => this.toggleDialog(driver)} />
        ))}
        <Dialog
          actions={this.dialogActions}
          active={this.isDialogActive}
          onEscKeyDown={() => this.toggleDialog()}
          title="Delete">
          <p>Are you sure you want to delete "{this.driverToDelete.name}"?</p>
        </Dialog>
      </div>
    );
  }
}
