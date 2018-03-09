// react libraries
import React from 'react';

// react-native libraries
import { StatusBar } from 'react-native'

const StatusBarComponent = ({ backgroundColor, barStyle}) => {
  return (
    <StatusBar
      // translucent
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      hidden = {false}
    />
  )
}

export { StatusBarComponent };
