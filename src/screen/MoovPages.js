// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, Text } from 'react-native';

// components
import { Tabs } from '../config/router';

class MoovPages extends React.Component {

  render() {
    const { container } = styles;

    return (
      <Tabs />
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export { MoovPages };