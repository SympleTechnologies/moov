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
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import {StatusBarComponent} from "../common";

// third-parties libraries
import RNGooglePlaces from 'react-native-google-places';
import { NavigationBar, Title, Icon, DropDownMenu, Subtitle, Caption, Heading, Image, ImagePreview } from '@shoutem/ui';
import Modal from 'react-native-simple-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { Card,  PricingCard, Button, ListItem } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import * as axios from "axios/index";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { Rating } from 'react-native-elements';
import { Callout } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient'

// component
import { GooglePlacesInput } from "../component";

class MoovHomepage extends React.Component {
  state= {
    userToken: '',

    myLocationAddress: '',
    myLocationLatitude: null,
    myLocationLongitude: null,
    myLocationName: '',

    myDestinationAddress: '',
    myDestinationLatitude: null,
    myDestinationLongitude: null,
    myDestinationName: '',

    price: 0,

    user: {
      wallet_amount: 0
    },

    filters: [
      { name: 'SLOT(S)', value: '0' },
      { name: '1', value: '1' },
      { name: '2', value: '2' },
      { name: '3', value: '3' },
      { name: '4', value: '4' },
      { name: '5', value: '5' },
      { name: '6', value: '6' },
      { name: '7', value: '7' },
    ],

    // schools: [
    //   { name: 'CHANGE SCHOOL', value: '0' },
    //   { name: 'Abia State University', value: 'Abia State University' },
    //   { name: 'Adekunle Ajasin University', value: 'Adekunle Ajasin University' },
    //   { name: 'Joseph Ayo Babalola University', value: 'Joseph Ayo Babalola University' },
    //   { name: 'Redeemer' + 's University Nigeria', value: 'Redeemer' + 's University Nigeria' },
    //   { name: 'Afe Babalola University', value: 'Afe Babalola University' },
    //   { name: 'Akwa Ibom State University', value: 'Akwa Ibom State University' },
    //   { name: 'American University of Nigeria', value: 'American University of Nigeria' },
    //   { name: 'Abubakar Tafawa Balewa University', value: 'Abubakar Tafawa Balewa University' },
    //   { name: 'Adamawa State University', value: 'Adamawa State University' },
    //   { name: 'Achievers University', value: 'Achievers University' },
    //   { name: 'Ahmadu Bello University', value: 'Ahmadu Bello University' },
    //   { name: 'Al-Hikmah University', value: 'Al-Hikmah University' },
    //   { name: 'Ambrose Alli University', value: 'Ambrose Alli University' },
    //   { name: 'Anambra State University', value: 'Anambra State University' },
    //   { name: 'Ajayi Crowther University', value: 'Ajayi Crowther University' },
    //   { name: 'Bayero University', value: 'Bayero University' },
    //   { name: 'Babcock University', value: 'Babcock University' },
    //   { name: 'Bells University of Technology', value: 'Bells University of Technology' },
    //   { name: 'Benson Idahosa University', value: 'Benson Idahosa University' },
    //   { name: 'Benue State University', value: 'Benue State University' },
    //   { name: 'ECWA Bingham University', value: 'ECWA Bingham University' },
    //   { name: 'Bowen University', value: 'Bowen University' },
    //   { name: 'Bukar Abba Ibrahim University', value: 'Bukar Abba Ibrahim University' },
    //   { name: 'CETEP City University', value: 'CETEP City University' },
    //   { name: 'Caleb University', value: 'Caleb University' },
    //   { name: 'Caritas University', value: 'Caritas University' },
    //   { name: 'City University', value: 'City University' },
    //   { name: 'National Open University of Nigeria', value: 'National Open University of Nigeria' },
    //   { name: 'City University of Technology', value: 'City University of Technology' },
    //   { name: 'Covenant University', value: 'Covenant University' },
    //   { name: 'Crawford University', value: 'Crawford University' },
    //   { name: 'Crescent University', value: 'Crescent University', },
    //   { name: 'Cross River University of Technology', value: 'Cross River University of Technology' },
    //   { name: 'Delta State University, Abraka', value: 'Delta State University, Abraka' },
    //   { name: 'Ebonyi State University', value: 'Ebonyi State University' },
    //   { name: 'Elizade University', value: 'Elizade University' },
    //   { name: 'Fountain University, Osogbo', value: 'Fountain University, Osogbo' },
    //   { name: 'Federal University, Dutsin-Ma', value: 'Federal University, Dutsin-Ma' },
    //   { name: 'Federal University of Technology Akure', value: 'Federal University of Technology Akure' },
    //   { name: 'Federal University Ndufe Alike, Ikwo', value: 'Federal University Ndufe Alike, Ikwo' },
    //   { name: 'Gregory University', value: 'Gregory University' },
    //   { name: 'Godfrey Okoye University', value: 'Godfrey Okoye University' },
    //   { name: 'Igbinedion University', value: 'Igbinedion University' },
    //   { name: 'Koladaisi University', value: 'Koladaisi University' },
    //   { name: 'Oduduwa University', value: 'Oduduwa University' },
    //   { name: 'Landmark University', value: 'Landmark University' },
    //   { name: 'Michael and Cecilia Ibru University', value: 'Michael and Cecilia Ibru University\t' },
    //   { name: 'Lagos State University', value: 'Lagos State University' },
    //   { name: 'Nigerian Turkish Nile University', value: 'Nigerian Turkish Nile University' },
    //   { name: 'Taraba State University', value: 'Taraba State University' },
    //   { name: 'University of Benin', value: 'University of Benin' },
    //   { name: 'University of Calabar', value: 'University of Calabar' },
    //   { name: 'University of Ibadan', value: 'University of Ibadan' },
    //   { name: 'Umaru Musa Yar' +'adua University Katsina', value: '' },
    //   { name: 'University of Lagos', value: 'University of Lagos' },
    //   { name: 'University of Port Harcourt', value: 'University of Port Harcourt' },
    //   { name: 'University of Nigeria, Nsukka', value: 'University of Nigeria, Nsukka' },
    //   { name: 'Veritas University', value: 'Veritas University' },
    // ],
    schools: [],
    changedSchool: false,

    selectedSlot: false,

    fetchingRide: false,

    driverDetails: '',
    // driverDetails: {
    //   image_url: 'https://statusandphoto.weebly.com/uploads/6/0/1/5/60158603/8347592_orig.png',
    //   location_latitude: 37.420927899999995,
    //   location_longitude: -122.08269380000002,
    //   firstname: 'Solomon',
    //   lastname: 'Dipo'
    // },
    driverDistance: '',
    driverTimeAway: '',

    canCancelRequest: true,
    trip: false,


  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      tabBarOnPress({ jumpToIndex, scene }) {
        // now we have access to Component methods
        params.onTabFocus();
        jumpToIndex(scene.index);
      }
    };
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.props.navigation.setParams({ onTabFocus: this.handleTabFocus });

    AsyncStorage.getItem("token").then((value) => {
      this.setState({ userToken: value });
    }).done();

    AsyncStorage.getItem("user").then((value) => {
      console.log('khkshdkhskhdhksdhkskhdhksdkhsdk', JSON.parse(value));
      this.setState({
        user: JSON.parse(value) ,
        schools: [
          { name: JSON.parse(value).school, value: JSON.parse(value).school },
        ],
      }, () => this.getAllSchool());
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
   * getAllSchool
   *
   * fetches all school
   */
  getAllSchool = () => {

    axios.get(`https://moov-backend-staging.herokuapp.com/api/v1/all_schools`)
      .then((response) => {
        console.log(response.data.data.schools);
        this.setState({
          schools: this.state.schools.concat(response.data.data.schools)
        });
      })
      .catch((error) => {
        Toast.showWithGravity(`Unable to fetch available schools`, Toast.LONG, Toast.TOP);
      });
  };

  /**
   * handleTabFocus
   *
   * handles on click of the MOOV tab
   */
  handleTabFocus = () => {
    console.log('Focused here')
    AsyncStorage.getItem("user").then((value) => {
      this.setState({ user: JSON.parse(value) });
    }).done();
  };

  /**
   * fetchUserDetails
   *
   * fetches User transaction from the back end and saves it in local storage
   * @param newBalance
   * @return {void}
   */
  fetchUserDetails = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.get('https://moov-backend-staging.herokuapp.com/api/v1/user')
      .then((response) => {
        console.log(response.data.data);
        AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      })
      .catch((error) => {
        console.log(error.response);
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
        console.log(place);
        this.setState({
          myLocationLatitude: place.latitude,
          myLocationLongitude: place.longitude,
          myLocationName: place.name,
          myLocationAddress: place.address,
          error: null,
        }, () => this.calculatePrice());
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
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
          if(Platform.OS === 'android') {
            Toast.showWithGravity(`Location cannot be thesame with destination`, Toast.LONG, Toast.TOP);
          }
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

  /**
   * calculatePrice
   *
   * Calls the get price to calculate price and give user real time feeling
   * @return {void}
   */
  calculatePrice = () => {
    if(this.state.myDestinationLatitude !== null && this.state.selectedSlot !== false) {
      this.getPrice();
    }
  };

  /**
   * getPrice
   *
   * This method gets the distance and calcultes the get Price method
   * @return {void}
   */
  getPrice = () => {
    console.log('gert price', this.state);
    let distance = this.getDistance(
      this.state.myLocationLatitude,
      this.state.myLocationLongitude,
      this.state.myDestinationLatitude,
      this.state.myDestinationLongitude
    );

    let price = Math.floor(distance) *  this.state.selectedSlot.value;

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

    return dist * 250
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
        console.log(results, 'Hello world');
        console.log(results[results.length - (results.length - 1)])

        this.setState({
          myLocationLatitude: results[results.length - (results.length - 1)].latitude,
          myLocationLongitude: results[results.length - (results.length - 1)].longitude,
          myLocationName: results[results.length - (results.length - 1)].name,
          myLocationAddress: results[results.length - (results.length - 1)].address,
          error: null,
        });
      })
      .catch((error) => {
        console.log(error.message)
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
   * getDriver
   *
   * gets available driver
   */
  getDriver = () => {
    let school;
    this.setState({ fetchingRide: !this.state.fetchingRide });

    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    if(this.state.changedSchool === false) {
      school = this.state.schools[0].name;
    } else {
      school = this.state.changedSchool.name;
    }

    axios.get(`https://moov-backend-staging.herokuapp.com/api/v1/driver`,{
      params: {
        user_location: `${this.state.myLocationLatitude},${this.state.myLocationLatitude}`,
        user_destination: `${this.state.myDestinationLatitude},${this.state.myDestinationLongitude}`,
        slots: this.state.selectedSlot.name,
        fare_charge: this.state.price,
        school
      }
    }).then((response) => {
        console.log(response.data);
        this.setState({
          driverDetails: response.data.data.driver,
        });
        this.setState({ fetchingRide: !this.state.fetchingRide, trip: true });
        Toast.showWithGravity(`YAY Driver found!`, Toast.LONG, Toast.TOP);
        this.startTimerCountDown(10);
        this.getDistanceFromDriver();
      })
      .catch((error) => {
        this.setState({ fetchingRide: !this.state.fetchingRide });
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });
  };

  startTimerCountDown = (duration) => {
    let timer = duration, minutes, seconds;

    setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      // display.textContent = minutes + ":" + seconds;
      // console.log(seconds);
      // console.log(seconds === '00');

      if(seconds === '00') {
        this.setState({ canCancelRequest: false })
      }

      if (--timer < 0) {
        timer = duration;
      }
    }, 500);

  };

  /**
   * getDistanceFromDriver
   *
   * gets distance between driver and user
   * @return {*}
   */
  getDistanceFromDriver = () => {
    axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${Number(this.state.driverDetails.location_latitude)},${Number(this.state.driverDetails.location_longitude)}&destinations=${(this.state.myLocationLatitude)},${Number(this.state.myLocationLongitude)}&key=AIzaSyAJvj05CARolm9AeGjbCaj8N0Jord3j0pc`)
      .then((response) => {
        this.getDriverDistanceAndTime(response.data.rows);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * getDriverDistanceAndTime
   *
   * gets driver's distance and time
   * @param {object} row - contains driver distance and time difference
   * @return {*}
   */
  getDriverDistanceAndTime = (row) => {
    Object.keys(row).forEach((key) => {
      console.log(key, row[key]["elements"]);
      console.log(key, row[key]["elements"][key]);
      console.log(key, row[key]["elements"][key].distance);
      console.log(key, row[key]["elements"][key].distance.text);
      console.log(key, row[key]["elements"][key].duration);
      console.log(key, row[key]["elements"][key].duration.text);
      this.setState({
        driverDistance: row[key]["elements"][key].distance.text,
        driverTimeAway: row[key]["elements"][key].duration.text,
      })
    });
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
   * verifyUserRoutes
   *
   * Verifies user location and destination
   * @return {void}
   */
  verifyUserRoutes = () => {
    if(this.state.myDestinationLatitude === null) {
      Toast.showWithGravity(`'Kindly select a destination'`, Toast.LONG, Toast.TOP);
    } else if(this.state.myDestinationLatitude === this.state.myLocationLatitude) {
      Toast.showWithGravity(`Location and destination cannot be the same`, Toast.LONG, Toast.TOP);
    } else if(this.state.selectedSlot === false) {
      Toast.showWithGravity(`Kindly request for slot(s)`, Toast.LONG, Toast.TOP);
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
    if(this.verifyUserRoutes()) {
      if(this.verifyFunds()) {
        Toast.showWithGravity(`Insufficient funds, kindly load wallet`, Toast.LONG, Toast.TOP)
      } else {
        Toast.showWithGravity(`Fetching...`, Toast.LONG, Toast.TOP);
        this.getDriver();
      }
    }
  };

  /**
   * cancelRequest
   *
   * cancel user request
   */
  cancelRequest = () => {
    if(this.state.canCancelRequest) {
      this.setState({
        trip: false
      }, Toast.showWithGravity(`Your request has been cancelled at no charge`, Toast.LONG, Toast.TOP))
    } else {
      Toast.showWithGravity(`You will be charged half the fare for cancelling after 5 minutes`, Toast.LONG, Toast.TOP);
    }
  };

  /**
   * appTopView
   *
   * reders the top view of the MOOV page
   * @return {*}
   */
  appTopView = () => {
    let { height, width } = Dimensions.get('window');

    const list = [
      {
        title: this.state.myLocationName ? `${this.state.myLocationName}` :'',
        icon: 'location-on',
        type: 'materia'
      },
      {
        title: this.state.myDestinationName ? `${this.state.myDestinationName}` :'',
        icon: 'location-arrow',
        type: 'font-awesome'
      },
    ];

    return this.state.trip === false
    ?
      <View/>
    :
      <View style={{ width: width / 1.25 }}>
        {
          list.map((item, i) => (
            <ListItem
              key={i}
              title={item.title}
              leftIcon={{ name: item.icon, color: '#820e0a', type: item.type }}
              containerStyle={{
                backgroundColor: 'white',
                marginBottom: 10
              }}
            />
          ))
        }
      </View>
  };

  /**
   * appMiddleView
   *
   * renders the middle view of the MOOV page
   * @return {*}
   */
  appMiddleView = () => {
    let { height, width } = Dimensions.get('window');
      return this.state.trip === false
        ?
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ width: '30%' }}>
                <Caption
                  style={{ color: '#333',
                    // textAlign: 'center',
                    backgroundColor: 'white',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 5,
                    marginTop: Platform.OS === 'android' ? 10 : 10,
                    paddingLeft: Platform.OS === 'android' ? width / 8: width / 9
                    // marginRight: Platform.OS === 'android' ? width / 1.7 : width / 10,
                  }} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
                >
                  Wallet: {this.state.user.wallet_amount}
                  {/*Wallet: ₦ {this.state.user.wallet_amount}*/}
                </Caption>
              </View>
              <View style={{ width: '70%', height: height / 20 }}>
                <DropDownMenu
                  options={this.state.schools}
                  selectedOption={this.state.changedSchool ? this.state.changedSchool : this.state.schools[0]}
                  onOptionSelected={(school) => this.setState({ changedSchool: school })}
                  titleProperty="name"
                  valueProperty="value"
                  visibleOptions={10}
                  vertical
                />
              </View>
            </View>

            <View style={{ width: width / 1.1, justifyContent: 'center', alignItems: 'center' }}>
              <Caption
                style={{ color: '#333',
                  textAlign: 'center',
                  backgroundColor: 'white',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 5,
                  marginTop: 20,
                }} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
              >
                FROM {this.state.myLocationName} TO {this.state.myDestinationName}
              </Caption>
              <Caption
                style={{ color: this.state.user.wallet_amount >= this.state.price ? 'green' : 'red',
                  textAlign: 'center',
                  backgroundColor: 'white',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 5,
                  marginTop: 10,
                }} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
              >
                Price ₦ {this.state.price}
              </Caption>
            </View>
          </View>
        :
          <View>
            <View style={{ marginTop: Platform.OS === 'android' ? 10 : 10, justifyContent: 'flex-start',
              alignItems: 'flex-start', }}>
              <View style={{ marginLeft: width / 45, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Image
                  styleName="medium-avatar"
                  source={{ uri: `${this.state.driverDetails.image_url}`}}
                />
                <View style={{ marginLeft: width / 35, paddingTop: 5, flexDirection: 'column' }}>
                  <Caption>Hi {this.state.user.firstname} {this.state.user.lastname}, my name is</Caption>
                  <Subtitle>{this.state.driverDetails.firstname} {this.state.driverDetails.lastname}</Subtitle>
                  <Caption>and I am {this.state.driverTimeAway ? this.state.driverTimeAway : 'few mins'} away.</Caption>
                  <Rating
                    // showRating
                    type="star"
                    fractions={1}
                    startingValue={3.6}
                    readonly
                    imageSize={15}
                    style={{ paddingVertical: 10 }}
                  />
                  <Caption></Caption>
                  <Caption>Toyota Camry - KJA - 193AA </Caption>
                  <Caption></Caption>
                  <Image
                    styleName="medium"
                    style={{
                      alignItems: 'center',
                      height: height / 14,
                      width: width / 2.7,
                    }}
                    source={require('../../assets/moov-car-side.png')}
                  />
                </View>
              </View>
            </View>
          </View>
  };

  render() {
    console.log(this.state);

    const { region } = this.props;

    const { container, activityIndicator, buttonTextStyle, mapStyle, map } = styles;

    let LocationMarkers, DestinationMarker, DriverMarker;

    if(this.state.myLocationName !== '') {
      LocationMarkers = {
        latitude: this.state.myLocationLatitude,
        longitude: this.state.myLocationLongitude,
      }
    }

    if(this.state.myDestinationName !== '') {
      DestinationMarker = {
        latitude: this.state.myDestinationLatitude,
        longitude: this.state.myDestinationLongitude,
      }
    }

    if(this.state.driverDetails !== '') {
      DriverMarker = {
        latitude: this.state.driverDetails.location_latitude,
        longitude: this.state.driverDetails.location_longitude,
      }
    }

    const list = [
      {
        title: this.state.myLocationName ? `${this.state.myLocationName}` :'',
        icon: 'location-on',
        type: 'materia'
      },
      {
        title: this.state.myDestinationName ? `${this.state.myDestinationName}` :'',
        icon: 'location-arrow',
        type: 'font-awesome'
      },
    ];


    let myDestination, myLocation;
    let { height, width } = Dimensions.get('window');
    let slots = [ { value: '1', }, { value: '2', }, { value: '3', }, { value: '4', } ];
    let priceLog = `₦ ${this.state.price}`;


    // FETCHING YOUR LOCATION
    if (this.state.myLocationLongitude === null) {
      return (
        <View style={{flex: 1,justifyContent: 'center', backgroundColor: 'white'}}>
          <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
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
        {
          this.state.trip === false
          ?
            <View
              style={{
                width: width / 1.2,
                marginBottom: width / 5,
              }}
            >
              <NavigationBar

                leftComponent={
                  <TouchableOpacity onPress={() => this.openSearchModalForMyLocation()} >
                    <Title>
                      PICK UP
                    </Title>
                  </TouchableOpacity>
                }

                centerComponent={
                  <TouchableOpacity onPress={() => this.openSearchModalForMyDestination()}>
                    <Title>
                      DROP OFF
                    </Title>
                  </TouchableOpacity>
                }

                rightComponent={
                  <DropDownMenu
                    options={this.state.filters}
                    selectedOption={this.state.selectedSlot ? this.state.selectedSlot : this.state.filters[0]}
                    onOptionSelected={(filter) => this.setState({ selectedSlot: filter }, () => this.calculatePrice())}
                    titleProperty="name"
                    valueProperty="value"
                    visibleOptions={10}
                    vertical
                  />
                }
              />
            </View>
          : <View/>
        }

        <View style={{ width: width , backgroundColor: '#fff', height: '100%' }}>
          <View style={{ width: width, height: '58%', backgroundColor: '#fff', }}>
            <View style={StyleSheet.absoluteFillObject}>
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
                />

                {
                  (this.state.myDestinationName !== '')
                    ? <Marker
                      coordinate={DestinationMarker}
                      title={`${this.state.myDestinationName}`}
                      description={`${this.state.myDestinationAddress}`}
                    />
                    : <View/>
                }

                {
                  (this.state.myDestinationName !== '')
                    ? <MapView.Polyline
                      coordinates={[LocationMarkers, DestinationMarker]}
                      strokeWidth={2}
                      strokeColor="blue"/>
                    : <View/>
                }

                {
                  (this.state.driverDetails !== '')
                    ? <MapView.Polyline
                      coordinates={[LocationMarkers, DriverMarker]}
                      strokeWidth={2}
                      strokeColor="red"/>
                    : <View/>
                }
                {
                  this.state.driverDetails !== ''
                    ?
                    <MapView.Marker
                      coordinate={DriverMarker}
                      // title={`${this.state.myLocationName}`}
                      // description={`${this.state.myLocationAddress}`}
                      // image={require('../../assets/moov-car-overhead.png')}
                      // style={{ width: 100, height: 200 }}
                    >
                      <Image
                        styleName="small"
                        source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-3.png'}}
                      />
                    </MapView.Marker>
                    : <View/>
                }
              </MapView>
              <View style={{ position: 'absolute', top: Platform.OS === 'android' ? 10 :30, left: 50 }}>
                {
                  this.appTopView()
                }
              </View>
            </View>
          </View>
          <View style={{ width: width, height: '40%', backgroundColor: '#fff', flexDirection: 'column' }}>
            <View style={{  backgroundColor: '#fff', width: width, height: this.state.trip === false ? '45%' : '80%', }}>
              {
                this.appMiddleView()
              }
            </View>
            <View style={{  backgroundColor: '#fff', width: width , height: '25%', alignItems: 'center'}}>
              {
                (this.state.fetchingRide)
                ? <View style={{ flexDirection: 'row', marginTop: 20}}>
                    <ActivityIndicator
                      color = '#004a80'
                      size = "large"
                      style={activityIndicator}
                    />
                  </View>
                : <TouchableOpacity style={{ marginTop: 5 }}>
                    <Button
                      title={this.state.trip === false ? 'CONTINUE' : 'CANCEL'}
                      buttonStyle={{
                        backgroundColor: this.state.trip === false ? "#333" : '#820e0a',
                        width: 300,
                        height: 45,
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 5
                      }}
                      onPress={this.state.trip === false ? this.submitRequest : this.cancelRequest}
                      containerStyle={{ marginTop: 20 }}
                    />
                  </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    zIndex: -1,
    height: Dimensions.get('window').height
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
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export { MoovHomepage };

// rgba(92, 99,216, 1)
