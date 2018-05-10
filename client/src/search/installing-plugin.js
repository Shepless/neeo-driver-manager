import React from 'react';
import {observer} from 'mobx-react';
import {Card, CardText} from 'react-toolbox/lib/card';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import FontIcon from 'react-toolbox/lib/font_icon';

const INSTALLING_TEXT_STYLES = {
  textAlign: 'center'
};

const PLUGIN_ICON_STYLES = {
  position: 'relative',
  top: '7px'
};

const InstallingPlugin = observer(({driver}) => (
  <Card>
    <CardText style={INSTALLING_TEXT_STYLES}>
      <div>
        <FontIcon value="memory" style={PLUGIN_ICON_STYLES} />
        Installing Driver "{driver.name}" from npm
      </div>
    </CardText>
    <CardText>
      <ProgressBar type="linear" mode="indeterminate" />
    </CardText>
  </Card>
));

export default InstallingPlugin;
