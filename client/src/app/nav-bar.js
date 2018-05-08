import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import GitHubIcon from './github-icon';

const NavBar = () => {
  const open = () => window.open('https://github.com/Shepless/neeo-driver-manager');

  return (
    <AppBar fixed={true} title='NEEO - Driver Manager' rightIcon={<GitHubIcon />} onRightIconClick={open}/>
  );
}

export default NavBar;
