// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, StyleSheet, View, Dimensions, Platform, PermissionsAndroid, ScrollView } from 'react-native';

// third-party library
import { Container, Drawer, Content, Icon, Input, Text, Picker } from 'native-base';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import MapView from 'react-native-maps';
// import Sea from '../component/SearchResult'

// component
import { HeaderComponent, SideBar } from "../component/Header";

// fonts
import { Fonts } from "../utils/Font";
import RNGooglePlaces from "react-native-google-places";
import { SearchResult } from "../component/SearchResult";

Mapbox.setAccessToken('pk.eyJ1IjoibW9vdiIsImEiOiJjamhrcnB2bzcycmt1MzZvNmw5eTIxZW9mIn0.3fn0qfWAXnou1v500tRRZA');

class Homepage extends Component {

  state={
    userToken: '',
    user: {
      wallet_amount: 0
    },

    loading: false,

    showToast: false,

    myLocationAddress: '',
    myLocationLatitude: null,
    myLocationLongitude: null,
    myLocationName: '',

    myDestinationAddress: '',
    myDestinationLatitude: null,
    myDestinationLongitude: null,
    myDestinationName: '',

    iosMapHeight: 1.3,
    androidMapHeight: 1.4,
    selectedSlot: "1",

    locationSearchQuery: '',
    destinationSearchQuery: '',

    onTextFocus: '',
    predictions: [],

    showPriceAndConfirmButton: false
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
   * onValueChange
   *
   * sets the selected school
   * @param value
   */
  onValueChange(value) {
    this.setState({
      selectedSlot: value
    });
  }

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
        this.getUserLocationUsingRN();
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
    );
    this.watchLocation();
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
        );
      })
      .catch((error) => {
        // console.log(error.message);
        this.getMyLocation();
      });
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
        console.log(position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  closeDrawer = () => {
    this.drawer._root.close()
  };

  openDrawer = () => {
    this.drawer._root.open()
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
          },
            // () => this.calculatePrice()
          );
        }
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  };

  guessLocation = () => {
    console.log('Yaay!', this.state.locationSearchQuery);
    if(this.state.locationSearchQuery.length >= 3) {
      this.setState({
        onTextFocus: 'location'
      });

      RNGooglePlaces.getAutocompletePredictions(`${this.state.locationSearchQuery}`, {
        country: 'NG'
      })
        .then((results) => this.setState({ predictions: results }))
        .catch((error) => console.log(error.message));
    }
  };

  guessDestination = () => {
    console.log('Yaay!', this.state.locationSearchQuery);
    if(this.state.destinationSearchQuery.length >= 3) {
      RNGooglePlaces.getAutocompletePredictions(`${this.state.destinationSearchQuery}`, {
        country: 'NG'
      })
        .then((results) => this.setState({ predictions: results }))
        .catch((error) => console.log(error.message));
    }
  };

  getSelectedLocation = (userSelectedDestination) => {
    console.log(userSelectedDestination, 'User Selected Location')
    RNGooglePlaces.lookUpPlaceByID(userSelectedDestination.placeID)
      .then((results) => {
        this.setState({
          myLocationAddress: results.address,
          myLocationLatitude: results.latitude,
          myLocationLongitude: results.longitude,
          myLocationName: results.name,
          locationSearchQuery: results.name,
          onTextFocus: ''
        })
      })
      .catch((error) => console.log(error.message));
  };

  getSelectedDestination = (userSelectedLocation) => {
    console.log(userSelectedLocation, 'User Selected Location')
    RNGooglePlaces.lookUpPlaceByID(userSelectedLocation.placeID)
      .then((results) => {
        this.setState({
          myDestinationAddress: results.address,
          myDestinationLatitude: results.latitude,
          myDestinationLongitude: results.longitude,
          myDestinationName: results.name,
          destinationSearchQuery: results.name,
          onTextFocus: '',
          showPriceAndConfirmButton: true
        })
      })
      .catch((error) => console.log(error.message));
  };

  render() {
    const { container, map } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.navigator} />}
        onClose={() => this.closeDrawer()} >
        <HeaderComponent onPress={() => this.openDrawer()} />
        <View style={{ width: width , backgroundColor: '#fff', height: '100%' }}>
          <View style={{ width: width, height: Platform.OS === 'ios' ?  '89%' :  '89%', backgroundColor: '#fff', }}>
            <View style={StyleSheet.absoluteFillObject}>
              <Mapbox.MapView
                style={[StyleSheet.absoluteFillObject, map, Mapbox.StyleURL.Light]}
                zoomLevel={15}
                centerCoordinate={[11.256, 43.770]}
                style={styles.container}>
              </Mapbox.MapView>
              <View style={{ position: 'absolute' }}>
                {
                  this.state.onTextFocus === 'location' && this.state.locationSearchQuery.length >= 3
                  ?
                    <View style={{ top: 76 }}>
                      <SearchResult predictions={this.state.predictions} onPress={this.getSelectedLocation} />
                    </View>
                  :
                    <Text/>
                }
                {
                  this.state.onTextFocus === 'destination'  && this.state.destinationSearchQuery.length >= 3
                  ?
                    <View keyboardShouldPersistTaps='always' style={{ top: 120 }}>
                      <SearchResult predictions={this.state.predictions} onPress={this.getSelectedDestination} />
                    </View>
                  :
                    <Text/>
                }
                <Content>
                  <ScrollView
                    // scrollEnabled={false} // the view itself doesn't scroll up/down (only if all fields fit into the screen)
                    // keyboardShouldPersistTaps='always' // make keyboard not disappear when tapping outside of input
                    // enableAutoAutomaticScroll={true}
                    contentContainerStyle={{
                      marginLeft: width / 20,
                      width: width / 1.1,
                      borderWidth: 1,
                      borderColor: '#b3b4b4',
                      borderRadius: 8,
                      borderBottomWidth: 0.5,
                      height: height / 11.5,
                      backgroundColor: 'white',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      style={{ marginLeft: width / 20, color: '#d3000d' }}
                      active
                      name='location-on'
                      type='MaterialIcons'
                      icon
                    />
                    <Input
                      value={this.state.locationSearchQuery}
                      placeholder={this.state.myLocationName === '' ? 'Enter Location' :`${this.state.myLocationName}`}
                      placeholderTextColor='#b3b4b4'
                      onChangeText={
                        locationSearchQuery => this.setState({ locationSearchQuery }, () => this.guessLocation())
                      }
                      autoCapitalize='none'
                      style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded, marginLeft: width / 20 }}
                    />
                  </ScrollView>
                  {
                    this.state.myLocationName !== '' && this.state.onTextFocus !== 'location'
                      ?
                      <ScrollView
                        // scrollEnabled={false} // the view itself doesn't scroll up/down (only if all fields fit into the screen)
                        // keyboardShouldPersistTaps='always' // make keyboard not disappear when tapping outside of input
                        enableAutoAutomaticScroll={true}
                        contentContainerStyle={{
                          marginLeft: width / 20,
                          marginBottom: height / 100000,
                          width: width / 1.1,
                          borderWidth: 1,
                          borderTopWidth: 0.5,
                          borderColor: '#b3b4b4',
                          borderRadius: 8,
                          height: height / 11.5,
                          backgroundColor: 'white',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          style={{ marginLeft: width / 20, color: '#ffc653' }}
                          active
                          name='location-on'
                          type='MaterialIcons'

                        />
                        <Input
                          value={this.state.destinationSearchQuery}
                          placeholder={this.state.myDestinationName === '' ? 'Enter Destination' : `${this.state.myDestinationName}`}
                          placeholderTextColor='#b3b4b4'
                          onChangeText={
                            destinationSearchQuery => this.setState({ destinationSearchQuery }, () => this.guessDestination())
                          }
                          autoCapitalize='none'
                          style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded, marginLeft: width / 20 }}
                          onFocus={() => this.setState({
                            onTextFocus: 'destination'
                          })}
                        />
                      </ScrollView>
                      : <Text/>
                  }
                </Content>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 25.5
                }}>
                <Content
                  // scrollEnabled={false} // the view itself doesn't scroll up/down (only if all fields fit into the screen)
                  // keyboardShouldPersistTaps='always' // make keyboard not disappear when tapping outside of input
                  enableAutoAutomaticScroll={true}
                  contentContainerStyle={{
                    marginTop: 15,
                    width: width / 2.1,
                    // borderWidth: 1,
                    // borderColor: '#b3b4b4',
                    // borderRadius: 8,
                    height: height / 11.5,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    style={{ color: '#d3000d' }}
                    active
                    name='location-on'
                    type='MaterialIcons'
                    icon
                  />
                  <Text style={{
                    fontWeight: '100',
                    fontFamily: Fonts.GothamRounded,
                    color: '#b3b4b4',
                    marginLeft: 7,
                    fontSize: 16.5,
                  }}>Number of Seats</Text>
                </Content>
                <Content
                  contentContainerStyle={{
                    marginTop: 15,
                    width: width / 3.5,
                    marginLeft: width / 10,
                    borderWidth: 1,
                    borderColor: '#b3b4b4',
                    borderRadius: 8,
                    height: height / 11.5,
                  }}>
                  <Picker
                    mode="dropdown"
                    textStyle={{ fontSize: 18, color:'#b3b4b4', fontWeight: '100' }}
                    iosHeader="Available"
                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                    placeholderIconColor="#d3000d"
                    style={{ width: undefined }}
                    selectedValue={this.state.selectedSlot}
                    onValueChange={this.onValueChange.bind(this)}
                  >
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                  </Picker>
                </Content>
              </View>

            </View>
          </View>
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export { Homepage }
