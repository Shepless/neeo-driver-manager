import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';

const STYLES = {
  position: 'absolute',
  right: '-30px',
  top: '27px',
  cursor: 'pointer',
  color: 'grey'
};

const CloseResults = ({onClick}) => (<FontIcon value="cancel" onClick={onClick} style={STYLES} />);
export default CloseResults;
