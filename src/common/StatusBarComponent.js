// react libraries
import React from 'react';

// react-native libraries
import { StatusBar } from 'react-native'

const StatusBarComponent = ({ backgroundColor}) => {
  return (
    <StatusBar
      translucent
      backgroundColor={backgroundColor}
      hidden = {false}
    />
  )
}

export { StatusBarComponent };
