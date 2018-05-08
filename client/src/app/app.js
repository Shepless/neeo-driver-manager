import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import NavBar from '@/app/nav-bar';
import Drivers from '@/drivers/drivers';
import SearchBox from '@/search/search-box';
import '@/app/app.css';

const App = observer(({store}) => (
  <section>
    <NavBar />
    <SearchBox />
    <Drivers drivers={store.drivers} />
  </section>
));

export default App;
