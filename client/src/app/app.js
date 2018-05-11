import React from 'react';
import {observer} from 'mobx-react';
import axios from 'axios';
import NavBar from '@/app/nav-bar';
import SearchBox from '@/search/search-box';
import Drivers from '@/drivers/drivers';

const App = observer(({store}) => {
  const onFilterChanged = (filter) => store.filter = filter;
  const onAction = (action) => {
    store.drivers.forEach(driver => {
      axios.put('/api/drivers', {
        name: driver.name,
        action
      });
    });
  };
  const onStopAll = () => onAction('stop');
  const onStartAll = () => onAction('start');

  return (
    <section>
      <NavBar onStopAll={onStopAll} onStartAll={onStartAll} onFilterChanged={onFilterChanged} />
      <SearchBox />
      <Drivers drivers={store.visibleDrivers} />
    </section>
  );
});

export default App;
