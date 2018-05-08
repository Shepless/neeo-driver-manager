import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import debounce from 'lodash/debounce';
import axios from 'axios';
import AutoComplete from 'react-toolbox/lib/autocomplete';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import FontIcon from 'react-toolbox/lib/font_icon';
import {Card, CardText} from 'react-toolbox/lib/card';

const SEARCH_BOX_STYLES = {
  width: '50%',
  margin: '70px auto 0'
};

const INSTALLING_TEXT_STYLES = {
  textAlign: 'center'
};

const PLUGIN_ICON_STYLES = {
  position: 'relative',
  top: '7px'
};

@observer
export default class SearchBox extends Component {
  @observable results = [];
  @observable isLoading = false;
  @observable isInstallingDriver = false;
  @observable selectedValue = null;
  search = debounce(query => axios.get(`/api/drivers/${query}`).then((response) => {
    this.results = response.data;
    this.isLoading = false;
  }), 1000);

  onQueryChange(query) {
    this.isLoading = true;
    this.search(query);
  }

  onChange(value) {
    this.selectedValue = value;
    this.isInstallingDriver = true;

    axios.post('/api/drivers', {
      name: value[0]
    }).then(() => {
      this.selectedValue = null;
      this.isInstallingDriver = false
    });

    this.results = [];
  }

  render() {
    return (
      <div style={SEARCH_BOX_STYLES}>
        {this.isInstallingDriver ?
          <Card>
            <CardText style={INSTALLING_TEXT_STYLES}>
              <div>
                <FontIcon value="memory" style={PLUGIN_ICON_STYLES} />
                Installing Driver "{this.selectedValue}"
              </div>
            </CardText>
            <CardText>
              <ProgressBar type="linear" mode="indeterminate" />
            </CardText>
          </Card> :
          <AutoComplete
            label="Search for drivers"
            source={this.results.map(result => result.name)}
            onQueryChange={(query) => this.onQueryChange(query)}
            onChange={(value) => this.onChange(value)} />
         }
        {this.isLoading ? <ProgressBar type="linear" mode="indeterminate" /> : null}
      </div>
    );
  }
}
