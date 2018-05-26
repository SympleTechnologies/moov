// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, StyleSheet } from 'react-native';

// third-party library
import { Container, Drawer } from 'native-base';
import Mapbox from '@mapbox/react-native-mapbox-gl';

// component
import { HeaderComponent, SideBar } from "../component/Header";

Mapbox.setAccessToken('pk.eyJ1IjoibW9vdiIsImEiOiJjamhrcnB2bzcycmt1MzZvNmw5eTIxZW9mIn0.3fn0qfWAXnou1v500tRRZA');

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

  closeDrawer = () => {
    this.drawer._root.close()
  };

  openDrawer = () => {
    this.drawer._root.open()
  };

  render() {
    console.log(this.state);
    const { container } = styles;

    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.navigator} />}
        onClose={() => this.closeDrawer()} >
        <Container style={styles.container}>
          <HeaderComponent onPress={() => this.openDrawer()} />
          {/*<Mapbox.MapView*/}
            {/*styleURL={Mapbox.StyleURL.Light}*/}
            {/*zoomLevel={15}*/}
            {/*centerCoordinate={[11.256, 43.770]}*/}
            {/*style={styles.container}>*/}
          {/*</Mapbox.MapView>*/}
        </Container>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { Homepage }
