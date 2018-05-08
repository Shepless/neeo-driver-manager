import React from 'react';
import {observer} from 'mobx-react';
import Driver from '@/drivers/driver';

const Drivers = observer(({drivers}) => (
  <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}}>
    {drivers.map((driver, index) => (
      <Driver key={index} driver={driver} />
    ))}
  </div>
));

export default Drivers;
