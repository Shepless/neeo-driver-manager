import React from 'react';
import {observer} from 'mobx-react';
import {List, ListSubHeader} from 'react-toolbox/lib/list';
import SearchResult from '@/search/search-result';
import CloseResults from '@/search/close-results';

const RESULTS_CONTAINER_STYLES = {
  boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.5)',
  position: 'absolute',
  top: '60px',
  left: '68px',
  width: 'calc(100% - 68px)',
  maxHeight: '350px',
  overflow: 'scroll',
  background: '#FFF',
  zIndex: 100
};

const SearchResults = observer(({items, onItemSelected}) => (
  items.length > 0 ?
    <div style={RESULTS_CONTAINER_STYLES}>
      <List>
        <ListSubHeader caption='Drivers found on npm...' />
        {items.map((item, index) => (
          <SearchResult key={index} item={item} onClick={onItemSelected.bind(null, item)} />
        ))}
      </List>
    </div> :
    null
));

export default SearchResults;
