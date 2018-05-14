// react library
import React, { Component } from 'react';

// react-native library
import { StyleSheet } from 'react-native';

// third-party library
import { Container, Text, Header } from 'native-base';

// common
import {StatusBarComponent} from "../common";

class MoovPage extends Component {

  render() {
    const { container } = styles;

    return (
      <Container style={container}>
        <Header
          style={{
            backgroundColor: '#fff'
          }}
        >
          <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        </Header>
        <Text>MOOV</Text>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export { MoovPage }
