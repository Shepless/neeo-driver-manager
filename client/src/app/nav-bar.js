import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import GitHubIcon from './github-icon';
import './app.css';

const NavBar = () => {
  const open = () => window.open('https://www.github.com');

  return (
    <AppBar fixed={true} title='NEEO - Driver Manager' rightIcon={<GitHubIcon />} onRightIconClick={open}/>
  );
}

export default NavBar;
