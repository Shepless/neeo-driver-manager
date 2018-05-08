import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card';
import Stats from '@/drivers/stats';
import PowerIcon from '@/drivers/power-icon';
import DeleteIcon from '@/drivers/delete-icon';

const containerStyle = {
  width: '48%',
  margin: '1%',
  alignSelf: 'flex-start'
};

@observer
export default class Driver extends Component {
  render() {
    return (
      <section style={containerStyle}>
        <Card>
          <CardTitle avatar={<PowerIcon driver={this.props.driver} />}
                    title={this.props.driver.name}
                    subtitle={this.props.driver.description} />
          <CardText>
          <DeleteIcon name={this.props.driver.name} />
            <Stats driver={this.props.driver} />
          </CardText>
        </Card>
      </section>
    );
  }
}
