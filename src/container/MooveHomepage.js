// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import {StatusBarComponent} from "../common";

class MoovHomepage extends React.Component {
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
    AsyncStorage.getItem("token").then((value) => {
      this.setState({ userToken: value });
    }).done();
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <Text>Moov Pages</Text>
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
    borderWidth: 1,
    borderColor: '#b3b4b4'
  },
});

export { MoovHomepage };