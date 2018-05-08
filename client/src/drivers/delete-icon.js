import React, {Component} from 'react';
import {observer} from 'mobx-react';
import axios from 'axios';
import FontIcon from 'react-toolbox/lib/font_icon';
import ProgressBar from 'react-toolbox/lib/progress_bar';

@observer
export default class DeleteIcon extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false };
  }

  delete() {
    this.setState({ isLoading: true });

    console.log(this.props.name)

    axios.delete('/api/drivers', {
      params: {
        name: this.props.name
      }
    });
  }

  render() {
    return (
      <div style={{ width: '35px', marginRight: '10px' }}>
        {
          this.state.isLoading ?
            <ProgressBar type="linear" mode="indeterminate" /> :
            <FontIcon onClick={() => this.delete()} value="delete" />
        }
      </div>
    );
  }
}
