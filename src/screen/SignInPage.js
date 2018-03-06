// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View } from 'react-native';

class SignInPage extends React.Component {
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
      <View style={container}>
        <Text>Sign In Page</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { SignInPage };