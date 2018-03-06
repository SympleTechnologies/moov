// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View } from 'react-native';
import { SignUpFormA, SignUpFormB, SignUpFormC } from "../component";

class SignUpPage extends React.Component {
  state= {
    userToken: '',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {

  }

  render() {
    const { container } = styles;
    console.log(this.state);

    return (
        <SignUpFormA />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export { SignUpPage };