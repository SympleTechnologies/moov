// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, PermissionsAndroid, Platform, StyleSheet, Dimensions } from 'react-native';

// third-party library
import { Container, Text, Header, Toast, Root } from 'native-base';
import * as axios from "axios/index";
import RNGooglePlaces from "react-native-google-places";

// common
import {CardCommon, FooterComponent, HeaderComponent, SpinnerCommon, StatusBarComponent} from "../common";

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

        Toast.show({ text: "User retrieved successfully !", buttonText: "Okay", type: "success" })
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
        });
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
    const { container } = styles;
    let { height, width } = Dimensions.get('window');

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
          <HeaderComponent
            options={this.state.slotDropDown}
            onValueChange={(filter) => this.setState({ selectedSlot: filter })}
            selectedOptions={this.state.selectedSlot ? this.state.selectedSlot : this.state.slotDropDown[0]}
          />
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

export { MoovPage }
