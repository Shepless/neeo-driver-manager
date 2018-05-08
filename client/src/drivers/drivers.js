import React from 'react';
import {observer} from 'mobx-react';
import Driver from '@/drivers/driver';

const DRIVER_STYLES = {
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row'
};

const Drivers = observer(({drivers}) => (
  <div style={DRIVER_STYLES}>
    {drivers.map((driver, index) => (
      <Driver key={index} driver={driver} />
    ))}
  </div>
));

export default Drivers;
