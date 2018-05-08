import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import axios from 'axios';
import FontIcon from 'react-toolbox/lib/font_icon';
import ProgressBar from 'react-toolbox/lib/progress_bar';

const BASE_ICON_STYLES = {
  cursor: 'pointer',
  display: 'inline'
};

const ICONS_CONTAINER_STYLES = {
  width: '60px',
  marginRight: '10px'
};

@observer
export default class PowerIcon extends Component {
  @observable isLoading = false;

  getStyle() {
    return {
      'color': (this.props.status === 'online') ? 'green' : 'red',
      ...BASE_ICON_STYLES
    }
  }

  togglePower() {
    this.isLoading = true;

    axios.put('/api/drivers', {
      name: this.props.name,
      action: (this.props.status === 'online') ? 'stop' : 'start'
    });
  }

  delete() {
    this.isLoading = true;

    axios.delete('/api/drivers', {
      params: {
        name: this.props.name
      }
    });
  }

  getIcon() {
    return (this.props.status === 'errored') ? 'error' : 'power_settings_new';
  }

  componentDidUpdate(prevState, prevProps, snapshot) {
    if (this.props.status !== prevState.status) {
      this.isLoading = false;
    }
  }

  render() {
    return (
      <div style={ICONS_CONTAINER_STYLES}>
        {
          this.isLoading ?
            <ProgressBar type="linear" mode="indeterminate" /> :
            <div>
              <FontIcon onClick={() => this.togglePower()} value={this.getIcon()} style={this.getStyle()} />
              <FontIcon onClick={() => this.delete()} value="delete" style={BASE_ICON_STYLES} />
            </div>
        }
      </div>
    );
  }
}
