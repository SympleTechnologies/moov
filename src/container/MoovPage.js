// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, PermissionsAndroid, Platform, StyleSheet, Dimensions, Switch } from 'react-native';

// third-party library
import { Container, Text, Header, Toast, Root, Content, List, ListItem, Icon, Body, Left, Right, Button } from 'native-base';
import * as axios from "axios/index";
import RNGooglePlaces from "react-native-google-places";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

// common
import { CardCommon, HeaderComponent, SpinnerCommon, StatusBarComponent } from "../common";

class MoovPage extends Component {

  state={
    userToken: '',
    user: {
      wallet_amount: 0
    },
    schools: [],

    myLocationAddress: '',
    myLocationLatitude: null,
    myLocationLongitude: null,
    myLocationName: '',

    loading: false,

    showToast: false,

    slotDropDown: [
      { name: '1', value: '1' },
      { name: '2', value: '2' },
      { name: '3', value: '3' },
      { name: '4', value: '4' },
      { name: '5', value: '5' },
      { name: '6', value: '6' },
      { name: '7', value: '7' },
    ],

    selectedSlot: false,

    price: 0,
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.getAllSchool();
    AsyncStorage.getItem("token").then((value) => {
      this.setState({ userToken: value }, () => this.fetchUserDetails());
    }).done();

    if(Platform.OS === 'ios') {
      this.getMyLocation();
    }

    if(Platform.OS === 'android') {
      this.requestLocationPermission()
        .then((response) => {
          // console.log(response, 'RESPONSE');
        });
      // console.log('Android');
    }
  };

  /**
   * fetchUserDetails
   *
   * fetches User transaction from the back end and saves it in local storage
   * @param newBalance
   * @return {void}
   */
  fetchUserDetails = () => {
    this.setState({ loading: !this.state.loading });
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.get('https://moov-backend-staging.herokuapp.com/api/v1/user')
      .then((response) => {
        // console.log(response.data.data);
        this.setState({
          user: response.data.data.user,
          loading: !this.state.loading
        });

        // Toast.show({ text: "User retrieved successfully !", buttonText: "Okay", type: "success" })
      })
      .catch((error) => {
        // console.log(error.response);
        this.setState({
          loading: !this.state.loading
        });

        Toast.show({ text: "Unable to retrieve user", buttonText: "Okay", type: "danger" })
      });
  };

  /**
   * getAllSchool
   *
   * fetches all school
   */
  getAllSchool = () => {

    axios.get(`https://moov-backend-staging.herokuapp.com/api/v1/all_schools`)
      .then((response) => {
        // console.log(response.data.data.schools);
        this.setState({
          schools: this.state.schools.concat(response.data.data.schools)
        });
      })
      .catch(() => {
        Toast.show({
          text: "Unable to fetch available schools",
          buttonText: "Okay",
          type: "danger"
        })
      });
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
        this.getUserLocationUsingRN();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
    );
    this.watchLocation();
  };

  /**
   * watchLocation
   *
   * Get's user location and sets it in the state as user moves
   * @return {void}
   */
  watchLocation = () => {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.getUserLocationUsingRN();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  };

  /**
   * getUserLocationUsingRN
   *
   * gets user location and sets the state
   */
  getUserLocationUsingRN = () => {
    RNGooglePlaces.getCurrentPlace()
      .then((results) => {
        // console.log(results, 'Hello world');
        // console.log(results[results.length - (results.length - 1)]);
        this.setState({
          myLocationLatitude: results[results.length - (results.length - 1)].latitude,
          myLocationLongitude: results[results.length - (results.length - 1)].longitude,
          myLocationName: results[results.length - (results.length - 1)].name,
          myLocationAddress: results[results.length - (results.length - 1)].address,
          error: null,
        },
          Toast.show({
            text: `Location found: ${results[results.length - (results.length - 1)].name}`,
            // buttonText: "Okay",
            duration: 4000,
            type: "success"
          })
        );
      })
      .catch((error) => {
        // console.log(error.message);
        this.getMyLocation();
      });
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
        // console.log("You can use the location");
        this.getMyLocation();
      } else {
        // console.log("Location permission denied");
        this.requestLocationPermission();
      }
    } catch (err) {
      console.warn(err)
    }
  };

  render() {
    console.log(this.state);
    const { container, map } = styles;
    let { height, width } = Dimensions.get('window');

    let LocationMarkers, DestinationMarker, DriverMarker;

    if(this.state.myLocationName !== '') {
      LocationMarkers = {
        latitude: this.state.myLocationLatitude,
        longitude: this.state.myLocationLongitude,
      }
    }

    // Fetching user location
    if (this.state.myLocationLongitude === null) {
      return (
        <Root>
          <Container style={container}>
            <Header
              style={{
                backgroundColor: '#fff'
              }}
            >
              <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
            </Header>
            <CardCommon
              text={
                Platform.OS === 'android'
                  ? 'Search on Google for Google Play Services download or update then close and re-open app.'
                  : 'Grant location permission to MOOV then close and re-open app'
              }
              value='Location'
            />
          </Container>
        </Root>
      )
    }

    // Fetching user details
    if (this.state.loading) {
      return (
        <Root>
          <Container style={container}>
            <HeaderComponent />
            <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
            <SpinnerCommon />
          </Container>
        </Root>
      )
    }

    return (
      <Root>
        <Container style={container}>
          <MapView
            style={[StyleSheet.absoluteFillObject, map]}
            region={{
              latitude: this.state.myLocationLatitude,
              longitude: this.state.myLocationLongitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            <Marker
              coordinate={LocationMarkers}
              title={`${this.state.myLocationName}`}
              description={`${this.state.myLocationAddress}`}
              pinColor='#820e0a'
            />
          </MapView>
          <HeaderComponent
            options={this.state.slotDropDown}
            onValueChange={(filter) => this.setState({ selectedSlot: filter })}
            selectedOptions={this.state.selectedSlot ? this.state.selectedSlot : this.state.slotDropDown[0]}
            priceValue={this.state.price}
            priceColor={this.state.price > this.state.user.wallet_amount ? 'red' : 'green'}
          />
          <Content>
            <List
              style={{
                alignItems: 'center',
                marginTop: 40,
              }}
            >
              <ListItem
                icon
                style={{
                  backgroundColor: '#fff',
                  width: width / 1.3,
                  shadowOpacity: 0.75,
                  shadowRadius: 5,
                  // shadowColor: '#b3b4b4',
                  shadowOffset: { height: 0, width: 0 },
                }}>
                <Left
                  style={{
                    backgroundColor: '#fff',
                    marginLeft: width / 20,
                  }}>
                  <Icon
                    name="location-arrow"
                    type="FontAwesome"
                  />
                </Left>
                <Body>
                <Text
                  style={{
                    // marginLeft: width / 15,
                  }}
                >Where to ?</Text>
                </Body>
                <Right>
                  <Switch value={false} />
                </Right>
              </ListItem>
            </List>
          </Content>

          <Content>
          </Content>
          <Content>
          </Content>

          <Content
            contentContainerStyle={{
              width: '90%',
              marginLeft: width / 20
            }}
          >
            <Button block dark><Text> REQUEST MOOV </Text></Button>
          </Content>

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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export { MoovPage }
