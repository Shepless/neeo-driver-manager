import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card';
import {List, ListDivider} from 'react-toolbox/lib/list';
import Button from 'react-toolbox/lib/button';
import Stats from '@/drivers/stats';

const CONTAINER_STYLES = {
  width: '31%',
  margin: '1%',
  alignSelf: 'flex-start'
};

const BUTTON_STYLES = {
  width: '50%'
};

const TITLE_CONTAINER = {
  display: 'block',
  width: '100%'
}

const TITLE_STYLES = {
  fontWeight: '500',
  fontSize: '1.4rem',
  letterSpacing: '0',
  lineHeight: '1.4',
  maxWidth: '100%',
  minWidth: '100px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const SUB_TITLE_STYLES = {
  color: 'rgb(117, 117, 117)',
  fontWeight: '500',
  fontSize: '0.85rem',
  letterSpacing: '0',
  lineHeight: '1.4',
  maxWidth: '100%',
  minWidth: '100px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const getPowerToggleLabel = (driver) => {
  return (driver.status === 'online') ? 'Stop' : 'Start';
};

const getPowerToggleIcon = (driver) => {
  return (driver.status === 'online') ? 'stop' : 'play_arrow';
};

const Driver = observer(({ driver, onTogglePower, onDelete }) => (
  <section style={CONTAINER_STYLES}>
    <Card>
      <CardTitle style={TITLE_CONTAINER}>
        <h5 style={TITLE_STYLES}>{driver.name}</h5>
        <p style={SUB_TITLE_STYLES}>{driver.description}</p>
      </CardTitle>
      <CardText>
        <Stats driver={driver} />
      </CardText>
      <List>
        <ListDivider />
      </List>
      <CardActions>
        <Button
          onClick={onTogglePower.bind(null, driver)}
          style={BUTTON_STYLES}
          label={getPowerToggleLabel(driver)}
          icon={getPowerToggleIcon(driver)} />
        <Button
          onClick={onDelete.bind(null, driver)}
          style={BUTTON_STYLES}
          label="Delete"
          icon="delete" />
      </CardActions>
    </Card>
  </section>
));

export default Driver;
