import React from 'react';
import {observer} from 'mobx-react';
import NavBar from '@/app/nav-bar';
import SearchBox from '@/search/search-box';
import Drivers from '@/drivers/drivers';
import '@/app/app.css';

const App = observer(({store}) => (
  <section>
    <NavBar />
    <SearchBox />
    <Drivers drivers={store.drivers} />
  </section>
));

export default App;
