// react library
import React, { Component } from 'react';

// react-native library
import {Dimensions, StyleSheet} from 'react-native';

// third-party library
import { Container, Text } from 'native-base';

// common

class MoovPage extends Component {

  state={

  };

  render() {
    const { container } = styles;

    return (
      <Container style={container}>
        <Text>MOOV</Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    zIndex: -1,
    height: Dimensions.get('window').height
  },
});

export { MoovPage }
