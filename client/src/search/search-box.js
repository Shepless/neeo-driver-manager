import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import debounce from 'lodash/debounce';
import axios from 'axios';
import AutoComplete from 'react-toolbox/lib/autocomplete';
import ProgressBar from 'react-toolbox/lib/progress_bar';

const SEARCH_BOX_STYLE = {
  width: '50%',
  margin: '70px auto 0'
};

@observer
export default class SearchBox extends Component {
  @observable results = [];
  @observable isLoading = false;
  search = debounce(query => axios.get(`/api/drivers/${query}`).then((response) => {
    this.results = response.data;
    this.isLoading = false;
  }), 1000);

  onQueryChange(query) {
    this.isLoading = true;
    this.search(query);
  }

  onChange(value) {
    axios.post('/api/drivers', {
      name: value[0]
    });

    this.results = [];
  }

  render() {
    return (
      <div style={SEARCH_BOX_STYLE}>
        <AutoComplete
          label="Search for drivers"
          source={this.results.map(result => result.name)}
          onQueryChange={(query) => this.onQueryChange(query)}
          onChange={(value) => this.onChange(value)}
        />
        {this.isLoading ? <ProgressBar type="linear" mode="indeterminate" /> : null}
      </div>
    );
  }
}
