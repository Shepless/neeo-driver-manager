import React, {Component} from 'react';
import {observable, toJS, isObservableObject} from 'mobx';
import {observer} from 'mobx-react';
import axios from 'axios';
import AutoComplete from 'react-toolbox/lib/autocomplete';

const SEARCH_BOX_STYLE = {
  width: '50%',
  margin: '70px auto 0'
};

@observer
export default class SearchBox extends Component {
  @observable results = [];

  onQueryChange(query) {
    axios.get(`/api/drivers/${query}`).then((response) => this.results = response.data);
  }

  onChange(value) {
    axios.post('/api/drivers', {
      name: value[0]
    });
  }

  render() {
    console.log(this.results.map)
    return (
      <div style={SEARCH_BOX_STYLE}>
        <AutoComplete
          label="Search for drivers"
          source={this.results.map(result => result.name)}
          onQueryChange={(query) => this.onQueryChange(query)}
          onChange={(value) => this.onChange(value)}
        />
      </div>
    );
  }
}
