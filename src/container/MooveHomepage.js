// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, Dimensions, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import {StatusBarComponent} from "../common";

// component
import { GooglePlacesInput } from "../component";
import Modal from 'react-native-simple-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { Card, Button, PricingCard, Icon, ListItem } from 'react-native-elements';
import { Heading, Subtitle, Caption } from '@shoutem/ui';

class MoovHomepage extends React.Component {
  state= {
    userToken: '',

    myLocationLatitude: null,
    myLocationLongitude: null,
    myLocationName: 'My Location',

    myDestinationLatitude: null,
    myDestinationLongitude: null,
    myDestinationName: '',

    price: '',

    requestSlot: 1,

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

    if(Platform.OS === 'ios') {
      this.getMyLocation();
    }

    if(Platform.OS === 'android') {
      this.requestLocationPermission()
        .then((response) => {
          console.log(response, 'RESPONSE');
        });
      console.log('Android');
    }
  };


  /**
   * getMyLocation
   *
   * Get's user location and sets it in the state
   * @return {void}
   */
  getMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("wokeeey");
        console.log(position);
        this.setState({
          myLocationLatitude: position.coords.latitude,
          myLocationLongitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
    );
  };

  /**
   * requestLocationPermission
   *
   * request permission for android users
   * @return {Promise<void>}
   */
  async requestLocationPermission () {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'MOOV App Location Permission',
          'message': 'MOOV App needs access to your location ' +
          'so you can order a cab.'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
        this.getMyLocation();
      } else {
        console.log("Location permission denied");
        this.requestLocationPermission();
      }
    } catch (err) {
      console.warn(err)
    }
  };

  /**
   * setUserLocation
   *
   * sets user location in the state
   * @param location
   * @param locationName
   */
  setUserLocation = (location, myLocationName) => {
    this.setState({
      myLocationLatitude: location.lat,
      myLocationLongitude: location.lng,
      myLocationName,
    });
  };

  /**
   * setUserDestination
   *
   * sets user destination in the state
   * @param {number} destination
   * @param {number} destinationName
   */
  setUserDestination = (destination, myDestinationName) => {
    this.setState({
      myDestinationLatitude: destination.lat,
      myDestinationLongitude: destination.lng,
      myDestinationName,
    });
  };

  render() {
    console.log(this.state);

    const { container, activityIndicator } = styles;

    let myDestination, myLocation;
    let { height, width } = Dimensions.get('window');
    let slots = [ { value: '1', }, { value: '2', }, { value: '3', }, { value: '4', } ];
    let priceLog = `₦ ${this.state.price}`;


    // FETCHING YOUR LOCATION
    if (this.state.myLocationLongitude === null) {
      return (
        <View style={{flex: 1,justifyContent: 'center', backgroundColor: 'white'}}>
          <StatusBarComponent />
          <Card
            title='FETCHING YOUR LOCATION'
            image={require('../../assets/scene-02.gif')}>
            <View style={{ flexDirection: 'row', marginTop: 20}}>
              <ActivityIndicator
                color = '#004a80'
                size = "large"
                style={activityIndicator}
              />
            </View>
            <View style={{marginBottom: 10, alignItems: 'center', marginTop: 20}}>
              <Caption>Grant location permission to MOOV.</Caption>
            </View>
            <Text style={{marginBottom: 10}}>
            </Text>
          </Card>
        </View>
      );
    }


    return (
      <View style={styles.container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <View style={{ backgroundColor: '#fff',height: height }}>
          <Modal
            modalStyle={{
              borderRadius: 2,
              margin: 20,
              padding: 10,
              backgroundColor: 'white'
            }}
            offset={this.state.offset}
            open={this.state.showModal}
            // open={true}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({showModal: false})}
            style={{alignItems: 'center'}}>
            <View>
              <PricingCard
                color='#004a80'
                title='Fee'
                price={priceLog}
                // info={['1 User(s)', 'Basic Support', 'All Core Features']}
                info={[
                  `${this.state.requestSlot} User(s)`,
                  `From ${this.state.myLocationName}`,
                  `To ${this.state.myDestinationName} `,
                  `Powered by Symple.tech`
                ]}
                button={{ title: 'Accept', icon: 'directions-car' }}
                onButtonPress={this.toggleMap}
              />
            </View>
          </Modal>
          <View style={{ flexDirection: 'column', ...Platform.select({
              ios: {
                marginTop: height / 10
              },
              android: {
                marginTop: height / 25
              },
            }),
            zIndex: -1,
            alignItems: 'center', justifyContent: 'center'
          }}>
            <View style={{ height: height / 4, width: '97%',}}>
              <GooglePlacesInput
                text='Change my location'
                onPress={(data, details = null) => {
                  console.log(data, details)
                  this.setUserLocation(details.geometry.location, details.name);
                }}
              />
            </View>
            <View style={{ height: height / 4, width: '97%'}}>
              <GooglePlacesInput
                text='TO'
                onPress={(data, details = null) => {
                  // console.log(data, details)
                  this.setUserDestination(details.geometry.location, details.name);
                }}
                text='To'
              />
            </View>
          </View>
          <View style={{ width: '90%', zIndex: -1, marginLeft: width / 20}}>
            <Dropdown
              label='slots'
              itemColor='blue'
              data={slots}
              value='1'
              onChangeText={ requestSlot => this.setState({ requestSlot }) }
            />
          </View>
          <View style={{ zIndex: -1, marginTop: 10 }}>
            {/*<ButtonTextComponent*/}
              {/*onPress={this.verifyRoutes}*/}
              {/*buttonText='MOOV'*/}
              {/*iconName='fast-forward'*/}
              {/*iconType='foundation'*/}
              {/*backgroundColor='#004a80'*/}
            {/*/>*/}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b3b4b4'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { MoovHomepage };