// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, StyleSheet, View } from 'react-native';

// third-party library
import { Container, Header, Toast, Root } from 'native-base';
import Mapbox from '@mapbox/react-native-mapbox-gl';

// common
import { StatusBarComponent } from "../common";

Mapbox.setAccessToken('pk.eyJ1IjoibW9vdiIsImEiOiJjamZqdjBkMXQwbWIxMndxOGRnM2ZrYnJ5In0.gIfbbgRAXH-OVjeZ14HVjA');

class Homepage extends Component {

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
      <View style={styles.container}>
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Street}
          zoomLevel={15}
          centerCoordinate={[11.256, 43.770]}
          style={styles.container}>
        </Mapbox.MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { Homepage }
