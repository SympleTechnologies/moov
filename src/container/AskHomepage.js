// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, StyleSheet } from 'react-native';

// third-party library
import { Container, Header, Toast, Root } from 'native-base';

// common
import { StatusBarComponent } from "../common";

class AskHomepage extends Component {

  state={
    userToken: '',
    user: {
      wallet_amount: 0
    },

    loading: false,

    showToast: false,
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      this.setState({ userToken: value });
    }).done();
  };

  render() {
    console.log(this.state);
    const { container } = styles;

    return (
      <Root>
        <Container style={container}>
          <Header style={{ backgroundColor: '#fff' }}>
            <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
          </Header>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export { AskHomepage }
