import React from 'react';
import {observer} from 'mobx-react';
import {ListItem, ListDivider} from 'react-toolbox/lib/list';
import InstallButton from '@/search/install-button';
import NpmLogo from '@/search/npm-logo';

const SearchResult = observer(({item, onClick}) => (
  <div>
    <ListItem
      disabled={item.isInstalled}
      avatar={<NpmLogo />}
      rightActions={[<InstallButton key="0" driver={item} onClick={onClick.bind(null, item)} />]}
      caption={item.name}
      legend={item.description} />
    <ListDivider />
  </div>
));

export default SearchResult;
