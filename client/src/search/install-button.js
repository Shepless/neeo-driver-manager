import React from 'react';
import {observer} from 'mobx-react';
import Button from 'react-toolbox/lib/button';

const getLabel = (driver) => {
  return driver.isInstalled ? 'Installed' : 'Install';
}

const InstallButton = observer(({driver, onClick}) => (
  <Button label={getLabel(driver)} raised primary onClick={onClick.bind(null, driver)} />
));

export default InstallButton;
