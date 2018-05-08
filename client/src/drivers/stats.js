import React from 'react';
import {observer} from 'mobx-react';
import {List, ListItem} from 'react-toolbox/lib/list';
import FontIcon from 'react-toolbox/lib/font_icon';

const avatarStyle = {
  fontSize: '40px'
};

const Stats = observer(({ driver }) => (
  <List>
    <ListItem
      avatar={<FontIcon value="memory" style={avatarStyle} />}
      caption='Memory'
      legend={driver.memory.toString()}
    />
    <ListItem
      avatar={<FontIcon value="equalizer" style={avatarStyle} />}
      caption='CPU'
      legend={driver.cpu.toString()}
    />
    <ListItem
      avatar={<FontIcon value="av_timer" style={avatarStyle} />}
      caption='Uptime'
      legend={driver.uptime.toString()}
    />
  </List>
));

export default Stats;
