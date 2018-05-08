import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Card, CardTitle, CardText} from 'react-toolbox/lib/card';
import Stats from '@/drivers/stats';
import Icons from '@/drivers/icons';

const CONTAINER_STYLES = {
  width: '48%',
  margin: '1%',
  alignSelf: 'flex-start'
};

const Driver = observer(({ driver }) => (
  <section style={CONTAINER_STYLES}>
    <Card>
      <CardTitle avatar={<Icons name={driver.name} status={driver.status} />}
                title={driver.name}
                subtitle={driver.description} />
      <CardText>
        <Stats driver={driver} />
      </CardText>
    </Card>
  </section>
));

export default Driver;
