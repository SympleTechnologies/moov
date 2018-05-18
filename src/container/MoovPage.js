// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, PermissionsAndroid, Platform, StyleSheet, Dimensions, Switch } from 'react-native';

// third-party library
import { Container, Text, Header, Toast, Root, Content, List, ListItem, Icon, Body, Left, Right, Button, Thumbnail } from 'native-base';
import { Icon as RNEIcon } from 'react-native-elements';
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

    myDestinationAddress: '',
    myDestinationLatitude: null,
    myDestinationLongitude: null,
    myDestinationName: '',

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
            duration: 3000,
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

  /**openSearchModalForMyDestination
   *
   * Opens modal for user to select destination
   * Saves user destination in the state
   * @return {void}
   */
  openSearchModalForMyDestination = () => {

    RNGooglePlaces.openPlacePickerModal()
      .then((place) => {
        console.log(place);
        if(this.state.myLocationName === place.name) {
          this.showErrorForRoute();
        } else {
          this.setState({
            myDestinationLatitude: place.latitude,
            myDestinationLongitude: place.longitude,
            myDestinationName: place.name,
            myDestinationAddress: place.address,
          }, () => this.calculatePrice());
        }
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  };

  showErrorForRoute = () => {
    Toast.show({
      text: "Location cannot be the same with destination",
      buttonText: "Okay",
      type: "danger",
      duration: 3000,
    });
  };

  /**
   * openSearchModalForMyLocation
   *
   * Opens modal for user to select location
   * Saves user location in the state
   * @return {void}
   */
  openSearchModalForMyLocation = () => {
    RNGooglePlaces.openPlacePickerModal()
      .then((place) => {
        if(this.state.myDestinationName === place.name) {
          this.showErrorForRoute();
        } else {
          this.setState({
            myLocationLatitude: place.latitude,
            myLocationLongitude: place.longitude,
            myLocationName: place.name,
            myLocationAddress: place.address,
            error: null,
          }, () => this.calculatePrice());
        }
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  };

  /**
   * calculatePrice
   *
   * Calls the get price to calculate price and give user real time feeling
   * @return {void}
   */
  calculatePrice = () => {
    if(this.state.myDestinationLatitude !== null) {
      this.getPrice();
    }
  };

  /**
   * getPrice
   *
   * This method gets the distance and calcultes the get Price method
   * @return {void|*}
   */
  getPrice = () => {
    console.log('gert price', this.state);
    let distance = this.getDistance(
      this.state.myLocationLatitude,
      this.state.myLocationLongitude,
      this.state.myDestinationLatitude,
      this.state.myDestinationLongitude
    );

    let price;

    if(this.state.selectedSlot === false) {
      price = Math.floor(distance);
    } else {
      price = Math.floor(distance) *  this.state.selectedSlot.value;
    }

    // this.setState({ price })
    return price < 100
      ? this.setState({ price : 100 })
      : this.setState({ price })
  };

  /**
   * getDistance
   *
   * Calculates the User's distance
   * @param lat1
   * @param lon1
   * @param lat2
   * @param lon2
   * @param unit
   * @return {number}
   */
  getDistance = (lat1, lon1, lat2, lon2, unit) =>  {
    let radlat1 = Math.PI * lat1/180;
    let radlat2 = Math.PI * lat2/180;
    let theta = lon1-lon2;
    let radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") { dist = dist * 1.609344 }
    if (unit === "N") { dist = dist * 0.8684 }

    return dist * 250
  };

  /**
   * submitRequest
   *
   * Submits user's request
   */
  submitRequest = () => {
    if(this.verifyUserRoutes()) {
      if(this.verifyFunds()) {
        Toast.show({ text: "Insufficient funds, kindly load wallet", buttonText: "Okay", type: "danger", position: "top" })
      } else {
        Toast.show({ text: "Fetching...", buttonText: "Okay", type: "success", position: "top" });
        this.getDriver();
      }
    }
  };

  /**
   * verifyUserRoutes
   *
   * Verifies user location and destination
   * @return {boolean}
   */
  verifyUserRoutes = () => {
    if(this.state.myDestinationLatitude === null) {
      Toast.show({ text: "Kindly select a destination", buttonText: "Okay", type: "danger", position: "top" })
    } else {
      return true;
    }
  };

  /**
   * verifyFunds
   *
   * checks if user has sufficient funds to order a cab
   * @return {*}
   */
  verifyFunds = () => {
    return this.state.price > this.state.user.wallet_amount;
  };

  /**
   * getDriver
   *
   * gets available driver
   */
  getDriver = () => {
    let school;
    this.setState({ fetchingRide: !this.state.fetchingRide });

    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    // if(this.state.changedSchool === false) {
    //   school = this.state.schools[0].name;
    // } else {
    //   school = this.state.changedSchool.name;
    // }

    axios.get(`https://private-1d8110-moovbackendv1.apiary-mock.com/api/v1/driver?user_location=lat,lon&&user_destination=lat,lon&&slots=2&&fare_charge=500`)
      .then((response) => {
        console.log(response.data);
        this.setState({
          driverDetails: response.data.data.driver,
        });
        this.setState({ fetchingRide: !this.state.fetchingRide, trip: true });
        Toast.show({ text: "YAY Driver found!.", buttonText: "Okay", type: "success", position: "top", duration: 3000 });
        // this.startTimerCountDown(10);
        // this.getDistanceFromDriver();
      })
      .catch((error) => {
        this.setState({ fetchingRide: !this.state.fetchingRide });
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });

    // axios.get(`https://moov-backend-staging.herokuapp.com/api/v1/driver`,{
    //   params: {
    //     user_location: `${this.state.myLocationLatitude},${this.state.myLocationLatitude}`,
    //     user_destination: `${this.state.myDestinationLatitude},${this.state.myDestinationLongitude}`,
    //     slots: this.state.selectedSlot.name,
    //     fare_charge: this.state.price,
    //     school
    //   }
    // }).then((response) => {
    //     console.log(response.data);
    //     this.setState({
    //       driverDetails: response.data.data.driver,
    //     });
    //     this.setState({ fetchingRide: !this.state.fetchingRide, trip: true });
    //     Toast.showWithGravity(`YAY Driver found!`, Toast.LONG, Toast.TOP);
    //     this.startTimerCountDown(10);
    //     this.getDistanceFromDriver();
    //   })
    //   .catch((error) => {
    //     this.setState({ fetchingRide: !this.state.fetchingRide });
    //     Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
    //   });
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
            onValueChange={(filter) => this.setState({ selectedSlot: filter }, () => this.calculatePrice())}
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
                    style={{
                      color: this.state.myDestinationName === '' ? 'black' : 'green'
                    }}
                  />
                </Left>
                <Body>
                <Text
                  onPress={() => this.openSearchModalForMyDestination()}
                  style={{
                    // marginLeft: width / 15,
                  }}
                >{this.state.myDestinationName === '' ? 'Where to ?' : `${this.state.myDestinationName}`}</Text>
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
              flexDirection: 'row',
              alignItems: 'stretch',
              justifyContent: 'space-around',

            }}>
            <Button
              onPress={() => this.openSearchModalForMyLocation()}
              style={{ height: height / 10 }}
              transparent
              light>
              <RNEIcon
                name='my-location'
                type='MaterialIcons'
                color='#ed1768'
                raised
                buttonStyle={{
                  backgroundColor: 'blue'
                }}
              />
            </Button>
            <Button
              style={{ height: height / 10 }}
              transparent
              light>
              <RNEIcon
                name='school'
                type='MaterialIcons'
                color='#ed1768'
                raised
              />
            </Button>
          </Content>
          <Content
            contentContainerStyle={{
              width: '90%',
              marginLeft: width / 20
            }}
          >
            <Button block dark onPress={this.submitRequest}><Text> REQUEST MOOV </Text></Button>
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
