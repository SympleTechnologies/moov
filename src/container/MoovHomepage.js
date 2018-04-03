// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Dimensions,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import {StatusBarComponent} from "../common";

// third-parties libraries
import RNGooglePlaces from 'react-native-google-places';
import { NavigationBar, Title, Icon, DropDownMenu, Subtitle, Caption, Heading } from '@shoutem/ui';
import Modal from 'react-native-simple-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { Card,  PricingCard, Button, ListItem } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import * as axios from "axios/index";

// component
import { GooglePlacesInput } from "../component";

class MoovHomepage extends React.Component {
  state= {
    userToken: '',

    myLocationLatitude: null,
    myLocationLongitude: null,
    myLocationName: '',

    myDestinationLatitude: null,
    myDestinationLongitude: null,
    myDestinationName: '',

    price: '',

    requestSlot: 1,

    user: [],

    filters: [
      { name: 'slot(s)', value: '0' },
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
    AsyncStorage.getItem("token").then((value) => {
      this.setState({ userToken: value });
    }).done();
    AsyncStorage.getItem("user").then((value) => {
      this.setState({ user: JSON.parse(value) });
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

  openSearchModalForMyLocation = () => {
    RNGooglePlaces.openPlacePickerModal()
      .then((place) => {
        console.log(place);
        this.setState({
          myLocationLatitude: place.latitude,
          myLocationLongitude: place.longitude,
          myLocationName: place.name,
          error: null,
        });
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  };

  openSearchModalForMyDestination = () => {

    RNGooglePlaces.openPlacePickerModal()
      .then((place) => {
        console.log(place);
        this.setState({
          myDestinationLatitude: place.latitude,
          myDestinationLongitude: place.longitude,
          myDestinationName: place.name,
        });
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  };

  /**
   * componentWillUnmount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

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
    // this.watchLocation();
  };

  getUserLocationUsingRN = () => {
    RNGooglePlaces.getCurrentPlace()
      .then((results) => {
        console.log(results.length - (results.length - 1))
        console.log(results[results.length - (results.length - 1)])

        this.setState({
          myLocationLatitude: results[results.length - (results.length - 1)].latitude,
          myLocationLongitude: results[results.length - (results.length - 1)].longitude,
          myLocationName: results[results.length - (results.length - 1)].name,
          error: null,
        });
      })
      .catch((error) => {
        console.log(error.message)
        this.getMyLocation();
      });
  }

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

  /**
   * verifyRoutes
   *
   * Verifies user location and destination
   * @return {void}
   */
  verifyRoutes = () => {
    if(this.state.myDestinationLatitude !== null) {
      this.getPrice();
    } else {
      Toast.showWithGravity(
        `Kindly select a destination`,
        Toast.LONG,
        Toast.TOP,
      );
    }
  };

  /**
   * getPrice
   *
   * This method gets the distance and calcultes the get Price method
   * @return {void}
   */
  getPrice = () => {
    let distance = this.getDistance(
      this.state.myLocationLatitude,
      this.state.myLocationLongitude,
      this.state.myDestinationLatitude,
      this.state.myDestinationLongitude
    );

    let price = Math.floor(distance) *  this.state.requestSlot;

    price = price;

    // this.setState({ price })
    return price < 100
      ? this.setState({ price : 100, showModal: !this.state.showModal })
      : this.setState({ price, showModal: !this.state.showModal })
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

    return dist * 500
  };

  getDriver = () => {
    this.setState({ showModal: !this.state.showModal })
  };

  /**
   * verifyFunds
   *
   * checks if user has sufficient funds to order a cab
   * @return {*}
   */
  verifyFunds = () => {
    return this.state.price > this.state.user.wallet_amount
      ? Toast.showWithGravity(`Insufficient funds, kindly load wallet`, Toast.LONG, Toast.TOP)
      : this.getDriver();
  };



  /**
   * verifyUserRoutes
   *
   * Verifies user location and destination
   * @return {void}
   */
  verifyUserRoutes = () => {
    if(this.state.myDestinationLatitude === null) {
      alert('Kindly select a destination');
    } else if(this.state.myDestinationLatitude === this.state.myLocationLatitude) {
      alert('Location and destination cannot be the same');
    } else if(this.state.selectedSlot === false) {
      alert('Kindly request for slot(s)');
    } else {
      return true;
    }
  };

  /**
   * submitRequest
   *
   * Submits user's request
   */
  submitRequest = () => {
    console.log('Yaaay', this.state)
    if(this.verifyUserRoutes()) {
      console.log('You can start booking now')
    }
  };

  render() {
    console.log(this.state);

    const { container, activityIndicator, buttonTextStyle } = styles;

    let myDestination, myLocation;
    let { height, width } = Dimensions.get('window');
    let slots = [ { value: '1', }, { value: '2', }, { value: '3', }, { value: '4', } ];
    let priceLog = `₦ ${this.state.price}`;


    // FETCHING YOUR LOCATION
    if (this.state.myLocationLongitude === null) {
      return (
        <View style={{flex: 1,justifyContent: 'center', backgroundColor: 'white'}}>
          <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
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
              {
                (Platform.OS === 'ios')
                  ? <Caption>Grant location permission to MOOV then close and re-open app.</Caption>
                  : <View>
                    <Caption>Search on Google for 'Google Play Services'</Caption>
                    <Caption>download or update then close and re-open app.</Caption>
                  </View>
              }
            </View>
            <Text style={{marginBottom: 10}}>
            </Text>
          </Card>
        </View>
      );
    }

    return (
      <View style={container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: width / 1.2,
            marginBottom: width / 5,
          }}
        >
          <NavigationBar
            leftComponent={
              <Title
                onPress={() => this.openSearchModalForMyLocation()}
              >
                FROM
              </Title>
            }

            centerComponent={
              <Title
                onPress={() => this.openSearchModalForMyDestination()}
              >
                TO
              </Title>
            }

            rightComponent={
              <DropDownMenu
                options={this.state.filters}
                selectedOption={this.state.selectedSlot ? this.state.selectedSlot : this.state.filters[0]}
                onOptionSelected={(filter) => this.setState({ selectedSlot: filter })}
                titleProperty="name"
                valueProperty="value"
                visibleOptions={5}
                vertical
              />
            }
          />
        </View>
        <View style={{ width: width, height: '100%', backgroundColor: 'white' }}>
          <View style={{ width: width, height: '60%', backgroundColor: '#333' }}>
            <Text>Map will be here</Text>
          </View>
          <View style={{ width: width, height: '40%', backgroundColor: 'white', flexDirection: 'column' }}>
            <View style={{  height: '45%' }}>
              <Caption style={{ color: '#333',
                textAlign: 'center',
                marginBottom: 20,
                backgroundColor: 'white',
                fontSize: 15,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 5,
                marginTop: 20,
              }} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Wallet: ₦ 5000 </Caption>
            </View>
            <View>
              <TouchableOpacity style={{ alignItems: 'center'}} onPress={this.submitRequest}>
                <Button
                  title='CONTINUE'
                  buttonStyle={{
                    backgroundColor: "rgba(92, 99,216, 1)",
                    width: 300,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5
                  }}
                  containerStyle={{ marginTop: 20 }}
                />
                <Text style={buttonTextStyle} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )

    // return (
    //   <View style={styles.container}>
    //     <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
    //     <View style={{ backgroundColor: '#fff',height: height }}>
    //       <Modal
    //         modalStyle={{
    //           borderRadius: 2,
    //           margin: 20,
    //           padding: 10,
    //           backgroundColor: 'white'
    //         }}
    //         offset={this.state.offset}
    //         open={this.state.showModal}
    //         // open={true}
    //         modalDidOpen={() => console.log('modal did open')}
    //         modalDidClose={() => this.setState({showModal: false})}
    //         style={{alignItems: 'center'}}>
    //         <View>
    //           <PricingCard
    //             color='#004a80'
    //             title='Fee'
    //             price={priceLog}
    //             // info={['1 User(s)', 'Basic Support', 'All Core Features']}
    //             info={[
    //               `${this.state.requestSlot} User(s)`,
    //               `From ${this.state.myLocationName}`,
    //               `To ${this.state.myDestinationName} `,
    //               `Powered by Symple.tech`
    //             ]}
    //             button={{ title: 'CONFIRM', icon: 'directions-car' }}
    //             onButtonPress={this.verifyFunds}
    //           />
    //         </View>
    //       </Modal>
    //       <View style={{ flexDirection: 'column', ...Platform.select({
    //           ios: {
    //             marginTop: height / 10
    //           },
    //           android: {
    //             marginTop: height / 25
    //           },
    //         }),
    //         zIndex: -1,
    //         alignItems: 'center', justifyContent: 'center'
    //       }}>
    //         <View style={{ height: height / 4, width: '97%',}}>
    //           <GooglePlacesInput
    //             text='Change my location'
    //             onPress={(data, details = null) => {
    //               console.log(data, details)
    //               this.setUserLocation(details.geometry.location, details.name);
    //             }}
    //           />
    //         </View>
    //         <View style={{ height: height / 4, width: '97%'}}>
    //           <GooglePlacesInput
    //             text='TO'
    //             onPress={(data, details = null) => {
    //               // console.log(data, details)
    //               this.setUserDestination(details.geometry.location, details.name);
    //             }}
    //             text='To'
    //           />
    //         </View>
    //       </View>
    //       <View style={{ width: '90%', zIndex: -1, marginLeft: width / 20}}>
    //         <Dropdown
    //           label='slots'
    //           itemColor='blue'
    //           data={slots}
    //           value='1'
    //           onChangeText={ requestSlot => this.setState({ requestSlot }) }
    //         />
    //       </View>
    //       <View style={{ zIndex: -1, marginTop: 10 }}>
    //         <TouchableOpacity style={{ alignItems: 'center'}} onPress={this.verifyRoutes}>
    //           <Text style={buttonTextStyle} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>MOOV</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    zIndex: -1
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
  },
  buttonTextStyle: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    fontSize: 15,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginTop: 20,
  },
});

export { MoovHomepage };