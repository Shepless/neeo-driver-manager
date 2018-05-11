import React, {Component} from 'react';
import {observer} from 'mobx-react';
import AppBar from 'react-toolbox/lib/app_bar';
import {IconMenu, MenuItem, MenuDivider} from 'react-toolbox/lib/menu';
import GitHubIcon from './github-icon';

const NavBar = observer(({onStopAll, onStartAll, onFilterChanged}) => {
  const open = () => window.open('https://github.com/Shepless/neeo-driver-manager');

  return (
    <AppBar
      fixed={true}
      title='NEEO - Driver Manager'
      rightIcon={<GitHubIcon />}
      onRightIconClick={() => this.open()}>
      <IconMenu style={{color: '#FFF !important'}} icon='settings' position='topRight' menuRipple>
        <MenuItem onClick={onStopAll} icon='stop' caption='Stop All' />
        <MenuItem onClick={onStartAll} icon='play_arrow' caption='Start All' />
        <MenuDivider />
        <MenuItem onClick={onFilterChanged.bind(null, 'online')} icon='done' caption='Filter - Online' />
        <MenuItem onClick={onFilterChanged.bind(null, 'stopped')} icon='highlight_off' caption='Filter - Stopped' />
        <MenuItem onClick={onFilterChanged.bind(null, 'errored')} icon='error' caption='Filter - Errored' />
        <MenuItem onClick={onFilterChanged.bind(null, '')} icon='clear' caption='Clear Filter' />
      </IconMenu>
    </AppBar>
  );
});

export default NavBar;
