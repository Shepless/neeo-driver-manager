import React from 'react';
import {observer} from 'mobx-react';
import Chip from 'react-toolbox/lib/chip';
import Avatar from 'react-toolbox/lib/avatar';
import FontIcon from 'react-toolbox/lib/font_icon';

const CHIP_STYLES = {
  display: 'block',
  margin: '10px auto',
  width: '100%'
};

const AVATAR_STYLES = {
  backgroundColor: 'gray'
};

const BOLD_STYLE = {
  fontWeight: '800'
};

const getStatusColour = (status) => {
  switch (status) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    case 'stopped':
      return 'red';
    case 'stopping':
      return 'orange';
    case 'deleting':
      return 'orange';
    case 'launching':
      return 'orange';
    case 'errored':
      return 'red';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'online':
      return 'done';
    case 'offline':
      return 'highlight_off';
    case 'stopped':
      return 'highlight_off';
    case 'errored':
      return 'error';
  }
};

const Stats = observer(({ driver }) => (
  <div>
    <div style={{ width: '45%', margin: '0 2.5%', float: 'left'}}>
      <Chip style={CHIP_STYLES}>
        <Avatar style={{backgroundColor: getStatusColour(driver.status)}} icon={getStatusIcon(driver.status)} />
        <strong style={BOLD_STYLE}>Status: </strong>
        <span style={{color: getStatusColour(driver.status)}}>{driver.status}</span>
      </Chip>
      <Chip style={CHIP_STYLES}>
        <Avatar style={AVATAR_STYLES} icon="av_timer" />
        <strong style={BOLD_STYLE}>Uptime:</strong> <span>{driver.uptime.toString()}</span>
      </Chip>

    </div>
    <div style={{ width: '45%', margin: '0 2.5%', float: 'left'}}>
      <Chip style={CHIP_STYLES}>
        <Avatar style={AVATAR_STYLES} icon="equalizer" />
        <strong style={BOLD_STYLE}>CPU:</strong> <span>{driver.cpu.toString()}</span>
      </Chip>
      <Chip style={CHIP_STYLES}>
        <Avatar style={AVATAR_STYLES} icon="memory" />
        <strong style={BOLD_STYLE}>Memory:</strong> <span>{driver.memory.toString()}</span>
      </Chip>
    </div>
  </div>
));

export default Stats;
