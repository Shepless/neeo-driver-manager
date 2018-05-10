import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import debounce from 'lodash/debounce';
import axios from 'axios';
import Input from 'react-toolbox/lib/input';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import FontIcon from 'react-toolbox/lib/font_icon';
import {Card, CardText} from 'react-toolbox/lib/card';
import SearchResults from '@/search/search-results';
import InstallingPlugin from '@/search/installing-plugin';
import CloseResults from '@/search/close-results';

const SEARCH_BOX_STYLES = {
  width: '50%',
  margin: '70px auto 0',
  position: 'relative'
};

const SEARCH_INPUT_STYLES = {
  border: '1px solid #E0E0E0',
  padding: '10px'
};

@observer
export default class SearchBox extends Component {
  @observable results = [];
  @observable isLoading = false;
  @observable isInstallingDriver = false;
  @observable showResults = false;
  @observable selectedItem = null;
  search = debounce(query =>
    axios.get(`/api/drivers/${query}`).then((response) => {
      this.results = response.data;
      this.isLoading = false;
      this.showResults = true;
    }).catch(() => {
      this.showResults = false;
      this.isLoading = false;
    }), 1000);

  onQueryChange(query) {
    query = query.replace(/[`~!#$%^&*()|+\=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '');

    if (!query) {
      return;
    }

    this.isLoading = true;
    this.showResults = false;
    this.search(query);
  }

  onChange(item) {
    if (!item) {
      return;
    }

    this.selectedItem = item;
    this.isInstallingDriver = true;

    axios.post('/api/drivers', {
      name: item.name
    }).then(() => {
      this.selectedItem = null;
      this.isInstallingDriver = false
    }).catch(() => {
      this.selectedItem = null;
      this.isInstallingDriver = false
    });

    this.results = [];
  }

  clearSearch() {
    this.results = [];
    this.showResults = false;
  }

  get isInstalling() {
    return this.isInstallingDriver && !!this.selectedItem;
  }

  render() {
    return (
      <div style={SEARCH_BOX_STYLES}>
        {
          this.isInstalling ?
            <InstallingPlugin driver={this.selectedItem} /> :
            <div>
              <Input style={SEARCH_INPUT_STYLES} icon="search" onChange={(value) => this.onQueryChange(value)}>
              {this.results.length > 0 ? <CloseResults onClick={() => this.clearSearch()} /> : null}
              </Input>
                {
                  this.showResults ?
                    <SearchResults items={this.results} onItemSelected={(item) => this.onChange(item)} />
                    : null
                }
            </div>
        }
        {this.isLoading ? <ProgressBar type="linear" mode="indeterminate" /> : null}
      </div>
    );
  }
}
