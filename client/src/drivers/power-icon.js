import React, {Component} from 'react';
import {observe} from 'mobx';
import {observer} from 'mobx-react';
import axios from 'axios';
import FontIcon from 'react-toolbox/lib/font_icon';
import ProgressBar from 'react-toolbox/lib/progress_bar';

const BASE_ICON_STYLES = {
  cursor: 'pointer',
  marginRight: '10px'
};

@observer
export default class PowerIcon extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
    observe(props.driver, 'status', (change) => this.setState({ isLoading: false }));
  }

  getStyle() {
    return {
      'color': (this.props.driver.status === 'online') ? 'green' : 'red',
      ...BASE_ICON_STYLES
    }
  }

  togglePower() {
    this.setState({ isLoading: true });

    axios.put('/api/drivers', {
      name: this.props.driver.name,
      action: (this.props.driver.status === 'online') ? 'stop' : 'start'
    });
  }

  getIcon() {
    return (this.props.driver.status === 'errored') ? 'error' : 'power_settings_new';
  }

  render() {
    return (
      <div style={{ width: '35px', marginRight: '10px' }}>
        {
          this.state.isLoading ?
            <ProgressBar type="linear" mode="indeterminate" /> :
            <FontIcon onClick={() => this.togglePower()} value={this.getIcon()} style={this.getStyle()} />
        }
      </div>
    );
  }
}
