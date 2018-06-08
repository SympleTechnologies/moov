// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, StyleSheet, View, Dimensions, Platform, PermissionsAndroid, ScrollView, ActivityIndicator, Image } from 'react-native';

// third-party library
import {
	Container,
	Drawer,
	Content,
	Icon,
	Input,
	Text,
	Picker,
	Left,
	Right,
	Button,
	Toast,
	Root,
	Card,
	CardItem,
	Body,
	Thumbnail
} from 'native-base';
import { Rating, Divider } from 'react-native-elements';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import Polyline from '@mapbox/polyline';
import MapView from 'react-native-maps';
// import Sea from '../component/SearchResult'

// component
import { HeaderComponent, SideBar } from "../component/Header";

// fonts
import { Fonts } from "../utils/Font";
import RNGooglePlaces from "react-native-google-places";
import { SearchResult } from "../component/SearchResult";
import * as axios from "axios/index";
import {StatusBarComponent} from "../common";

Mapbox.setAccessToken('pk.eyJ1IjoibW9vdiIsImEiOiJjamhrcnB2bzcycmt1MzZvNmw5eTIxZW9mIn0.3fn0qfWAXnou1v500tRRZA');

class Homepage extends Component {
	constructor(props) {
		super(props);
		
		
		this.state = {
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
			
			selectedSlot: "1",
			
			locationSearchQuery: '',
			destinationSearchQuery: '',
			
			onTextFocus: '',
			predictions: [],
			
			showPriceAndConfirmButton: false,
			
			price: 0,
			
			driverDetails: '',
			driverDistance: '',
			driverTimeAway: '',
			
			hasPosition: false,
			
			shape: '',
		};
	}

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
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
	 * navigateToProfilePage
	 *
	 * navigates to profile page
	 * @return {void}
	 */
	navigateToTabPage = (page) => {
		const { navigate } = this.props.navigation;
		navigate(page);
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
        this.setState({
          user: response.data.data.user,
	        driverDetails: response.data.data.user.current_ride ? response.data.data.user.current_ride.driver_info : ''
        }, () => response.data.data.user.current_ride ? this.getDistanceFromDriver() : '');
	
	      // this.setState({
		     //  user: response.data.data.user,
		     //  driverDetails: response.data.data.user.current_ride.driver_info ? response.data.data.user.current_ride.driver_info : ''
	      // }, () => this.getDistanceFromDriver());

        // Toast.show({ text: "User retrieved successfully !", buttonText: "Okay", type: "success" })
      })
      .catch((error) => {
        console.log(error.response.data);

        Toast.show({ text: "Unable to retrieve user", buttonText: "Okay", type: "danger" })
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
      // console.warn(err)
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
    }, () => this.calculatePrice());
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
	      this.setState({
		      latitude: position.coords.latitude,
		      longitude: position.coords.longitude,
		      error: null,
	      });
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
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };
  
  /**
   * closeDrawer
   *
   * closes the side bar
   */
  closeDrawer = () => {
    this.drawer._root.close()
  };

  /**
   * openDrawer
   *
   * opens side bar
   */
  openDrawer = () => {
    this.drawer._root.open()
  };

  /**
   * guessLocation
   *
   * predicts user's location using RNGooglePlaces getAutocompletePredictions
   */
  guessLocation = () => {
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

  /**
   * guessDestination
   *
   * predicts destinations using RNGooglePlaces getAutocompletePredictions
   */
  guessDestination = () => {
    if(this.state.destinationSearchQuery.length >= 3) {
      RNGooglePlaces.getAutocompletePredictions(`${this.state.destinationSearchQuery}`, {
        country: 'NG'
      })
        .then((results) => this.setState({ predictions: results }))
        .catch((error) => console.log(error.message));
    }
  };

  /**
   * getSelectedLocation
   *
   * gets user's selected location
   * @param userSelectedDestination
   */
  getSelectedLocation = (userSelectedDestination) => {
    RNGooglePlaces.lookUpPlaceByID(userSelectedDestination.placeID)
      .then((results) => {
        this.setState({
          myLocationAddress: results.address,
          myLocationLatitude: results.latitude,
          myLocationLongitude: results.longitude,
          myLocationName: results.name,
          locationSearchQuery: results.name,
          onTextFocus: ''
        }, () => {
          this.calculatePrice();
          this.getDirections()
        })
      })
      .catch((error) => console.log(error.message));
  };

  /**
   * getSelectedDestination
   *
   * gets user's selected destination
   * @param userSelectedLocation
   */
  getSelectedDestination = (userSelectedLocation) => {
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
        }, () => {
          this.calculatePrice();
          this.getDirections(`${this.state.myLocationLatitude},${this.state.myLocationLongitude}`,`${this.state.myDestinationLatitude},${this.state.myDestinationLongitude}`)
        })
      })
      .catch((error) => console.log(error.message));
  };
	
	/**
	 *
	 * @return {Promise<void>}
	 */
  async getDirections() {
    if (this.state.myLocationLatitude != null && this.state.myDestinationLatitude!=null) {
      axios.get(`https://maps.googleapis.com/maps/api/directions/json?units=imperial&origin=${Number(this.state.myLocationLatitude)},${Number(this.state.myLocationLongitude)}&destination=${Number(this.state.myDestinationLatitude)},${Number(this.state.myDestinationLongitude)}&mode=driving`)
        .then((response) => {
          this.mapsPoints(response.data);
        })
        .catch((error) => {
        });
    }

  }
	
	/**
	 * mapsPoints
	 *
	 * maps each location point to state
	 * @param response
	 */
  mapsPoints = (response) => {
    let points = Polyline.decode(response.routes["0"].overview_polyline.points)
    let coords = points.map((point, index) => {
      return  [ point[1], point[0] ]
    });

    this.setState({
	    coords
    }, () => this.returnStringEncodedPolyline());

  };
	
	/**
	 * returnStringEncodedPolyline
	 *
	 * returns an object of routes
	 */
	returnStringEncodedPolyline = () => {
	  let shape = {
		  type: 'Feature',
		  properties: {},
		  geometry: {
			  type: 'LineString',
			  coordinates: this.state.coords
		  },
	  };
	  
	  
	  this.setState({
      shape
    })
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
    let distance = this.getDistance(
      this.state.myLocationLatitude,
      this.state.myLocationLongitude,
      this.state.myDestinationLatitude,
      this.state.myDestinationLongitude
    );

    let price = Math.floor(distance) *  this.state.selectedSlot;

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
    if(this.verifyFunds()) {
      Toast.show({ text: "Insufficient funds, kindly load wallet", type: "danger", position: "top" })
    } else {
      Toast.show({ text: "Fetching...", type: "success", position: "top" });
      this.getDriver();
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
    this.setState({ loading: !this.state.loading });
    let school;

    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.get(`https://moov-backend-staging.herokuapp.com/api/v1/driver`,{
      params: {
        user_location: `${this.state.myLocationLatitude},${this.state.myLocationLongitude}`,
	      user_location_name: this.state.myLocationName,
        user_destination: `${this.state.myDestinationLatitude},${this.state.myDestinationLongitude}`,
	      user_destination_name: this.state.myDestinationName,
        slots: this.state.selectedSlot,
        fare_charge: this.state.price,
        school: this.state.user.school,
      }
    }).then((response) => {
    	console.log(response.data.data.driver)
	    this.setState({
		    driverDetails: response.data.data.driver,
		    loading: !this.state.loading
	    }, () => this.getDistanceFromDriver());
	    this.setState({ fetchingRide: !this.state.fetchingRide, trip: true });
	    Toast.show({ text: "YAY Driver found!.", type: "success", position: "top", duration: 3000 });
        // this.startTimerCountDown(10);
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
	      Toast.show({ text: `${error.response.data.data.message} :(`, type: "danger", position: "top", duration: 3000 });
      });
  };

  /**
   * getDistanceFromDriver
   *
   * gets distance between driver and user
   * @return {*}
   */
  getDistanceFromDriver = () => {
  	console.log('djshdhshsdhshkdhksdhkdshkdhkdkhdshksdhkdshksdhkksdkhds')
  	console.log(this.state.driverDetails)
  	console.log(this.state.driverDetails.driver_location[0]);
  	console.log(this.state.driverDetails.driver_location[1]);
  	
  	let userLocationLatitude;
  	let userLocationLongitude;
	
	  if(this.state.user.current_ride)  {
		  userLocationLatitude = this.state.user.current_ride.user_location[0];
		  userLocationLongitude = this.state.user.current_ride.user_location[1];
	  } else {
		  userLocationLatitude = this.state.myLocationLatitude;
		  userLocationLongitude = this.state.myLocationLongitude;
	  }
	  
	  console.log(userLocationLatitude, userLocationLongitude)
  	
    axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${Number(this.state.driverDetails.driver_location[0])},${Number(this.state.driverDetails.driver_location[1])}&destinations=${(userLocationLatitude)},${Number(userLocationLongitude)}&key=AIzaSyAJvj05CARolm9AeGjbCaj8N0Jord3j0pc`)
      .then((response) => {
        this.getDriverDistanceAndTime(response.data.rows);
      })
      .catch((error) => {
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
  	console.log('called', row)
    Object.keys(row).forEach((key) => {
      this.setState({
        driverDistance: row[key]["elements"][key].distance.text,
        driverTimeAway: row[key]["elements"][key].duration.text,
      })
    });
  };
	
	/**
	 * renderAnnotationsForAndroid
	 *
	 * Android location problem fixed using temporary location anotation
	 * @return {*}
	 */
	renderAnnotationsForAndroid () {
		return (
			<Mapbox.PointAnnotation
				key='pointAnnotation'
				id='pointAnnotation'
				coordinate={this.state.myLocationLatitude !== null ? [this.state.myLocationLongitude, this.state.myLocationLatitude] : [11.254, 43.772]}>
				
				<View style={styles.annotationContainer}>
					<View style={{width: 30,
						height: 30,
						borderRadius: 15,
						backgroundColor: '#057cff',
						transform: [{ scale: 0.6 }],}}
          />
				</View>
				<Mapbox.Callout title={`My Location: ${this.state.myLocationAddress}`} />
			</Mapbox.PointAnnotation>
		)
	}
	
	/**
	 * navigateToWalletPage
	 *
	 * navigates user to  wallet page
	 */
	navigateToWalletPage = () => {
		const { navigate } = this.props.navigation;
		navigate('Wallet');
	};

  render() {
    console.log(this.state, 'knfdkndfn');
    const { map, activityIndicator } = styles;
    let { height, width } = Dimensions.get('window');
    
    let driverName = '';
    
    if(this.state.driverDetails.firstname) {
    	driverName = this.state.driverDetails.firstname.charAt(0).toUpperCase() + this.state.driverDetails.firstname.slice(1) + ' ' +
	    this.state.driverDetails.lastname.charAt(0).toUpperCase() + this.state.driverDetails.lastname.slice(1) ;
    }

    let myDestination;
    let myLocation = [];

    if(this.state.myLocationLatitude) {
      myDestination = [this.state.myDestinationLongitude, this.state.myDestinationLatitude]
      myLocation = [this.state.myLocationLongitude, this.state.myLocationLatitude]
    }
	
	  // ACTIVITY INDICATOR
	  if (this.state.loading) {
		  return (
			  <Root>
				  <View style={{ flex: 1, backgroundColor: 'white' }}>
					  <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
					  <ActivityIndicator
						  color = '#004a80'
						  size = "large"
						  style={activityIndicator}
					  />
				  </View>
			  </Root>
		  );
	  }

    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar tab={'Homepage'} navigateToTabPage={this.navigateToTabPage} />}
        onClose={() => this.closeDrawer()} >
	      <View style={StyleSheet.absoluteFillObject}>
		      <Mapbox.MapView
			      styleURL={Mapbox.StyleURL.Light}
			      zoomLevel={15}
			      centerCoordinate={myLocation.length <  1 ? [11.256, 43.770] : myLocation}
			      style={styles.container}
			      showUserLocation={Platform.OS === 'ios'}
		      >
			      {
				      Platform.OS === 'ios' ? <View/> : this.renderAnnotationsForAndroid()
			      }
			
			      {
				      this.state.shape !== ''
					      ?
					      <Mapbox.ShapeSource
						      id='myRoute'
						      shape={this.state.shape}
					      >
						      <Mapbox.LineLayer
							      id='routeFill'
							      style={layerStyles.route}
						      />
					      </Mapbox.ShapeSource>
					      :
					      <View/>
			      }
			
			      {
				      this.state.myDestinationLatitude !== null
					      ?
					      <Mapbox.PointAnnotation
						      key='pointAnnotation1'
						      id='pointAnnotation1'
						      coordinate={myDestination}>
						
						      <View style={styles.annotationContainer}>
							      <View style={styles.annotationFill} />
						      </View>
						      <Mapbox.Callout title={`${this.state.myDestinationAddress}`} />
					      </Mapbox.PointAnnotation>
					      : <View/>
			      }
		
		      </Mapbox.MapView>
	      </View>
	      <HeaderComponent onPress={() => this.openDrawer()} />
	      <View style={{ position: 'absolute', marginTop: 60 }}>
		      {
			      this.state.onTextFocus === 'location' && this.state.locationSearchQuery.length >= 3
				      ?
				      <View style={{ top: Platform.OS === 'ios' ? 130 : 126 }}>
					      <SearchResult predictions={this.state.predictions} onPress={this.getSelectedLocation} />
				      </View>
				      :
				      <Text/>
		      }
		      {
			      this.state.onTextFocus === 'destination'  && this.state.destinationSearchQuery.length >= 3
				      ?
				      <View keyboardShouldPersistTaps='always' style={{ top: Platform.OS === 'ios' ? 115 : 120 }}>
					      <SearchResult predictions={this.state.predictions} onPress={this.getSelectedDestination} />
				      </View>
				      :
				      <Text/>
		      }
		      <ScrollView
			      contentContainerStyle={{
				      width: width / 1.15,
				      marginLeft: 25,
			      }}
		      >
			      <Card style={{
				      borderWidth: 0,
				      borderColor: 'rgba(0,0,0,0)',
				      backgroundColor: 'rgba(0,0,0,0)',
				      shadowOffset: { height: 0, width: 0 },
				      shadowOpacity: 0,
				      elevation:0
			      }}>
				      <CardItem style={{
					      borderColor: '#d4d4d4',
					      borderRadius: 8,
					      borderWidth: 1,
					      borderBottomWidth: 0.5,
					      height: height / 12
				      }}>
					      <Body
						      style={{
							      flexDirection: 'row',
							      alignItems: 'center',
							      justifyContent: 'center',
						      }}>
					      <Icon
						      style={{ marginLeft: 10, color: '#057cff' }}
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
						      style={{ color: '#333', fontWeight: '100', fontFamily: Fonts.GothamRounded, marginLeft: 10 }}
					      />
					      </Body>
				      </CardItem>
				      <CardItem style={{
					      borderColor: '#d4d4d4',
					      borderRadius: 8,
					      borderWidth: 1,
					      borderTopWidth: 0.5,
					      height: height / 12
				      }}>
					      <Body
						      style={{
							      flexDirection: 'row',
							      alignItems: 'center',
							      justifyContent: 'center',
						      }}
					      >
					      <Icon
						      style={{ marginLeft: 10, color: '#f5a623' }}
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
						      style={{ color: '#333', fontWeight: '100', fontFamily: Fonts.GothamRounded, marginLeft: 10 }}
						      onFocus={() => this.setState({
							      onTextFocus: 'destination'
						      })}
					      />
					      </Body>
				      </CardItem>
			      </Card>
		      </ScrollView>
		
		      {
			      this.state.driverDetails === '' && this.state.myDestinationName !== ''
			        ?
				        <View
					      style={{
						      backgroundColor: '#fff',
						      height: this.state.price > 0 ? height / 2.5 : height / 8,
						      width: width,
						      marginTop: this.state.price > 0 ? height / 3 : Platform.OS === 'ios' ? height / 1.8 : height / 1.8
					      }}
				      >
					      <View
						      style={{
							      flexDirection: 'row',
							      alignItems: 'center',
							      justifyContent: 'center',
							      marginLeft: 45,
							      marginTop: 15,
						      }}>
						
						      <Body
							      style={{
								      flexDirection: 'row',
								      alignItems: 'center',
							      }}>
							      <Left style={{
								      flexDirection: 'row',
								      alignItems: 'center',
								      // justifyContent: 'flex-start',
							      }}>
								      <Icon
									      style={{ color: '#ed1368' }}
									      active
									      name='airline-seat-recline-extra'
									      type='MaterialIcons'
									      icon
								      />
								      <Text style={{
									      fontWeight: '100',
									      fontFamily: Fonts.GothamRounded,
									      color: '#b3b4b4',
									      fontSize: 16,
									      textAlign: 'center',
									      marginLeft: 15,
								      }}>Number of Seat(s)</Text>
							      </Left>
							      <Body>
								      <CardItem style={{
									      borderColor: '#d4d4d4',
									      borderRadius: 8,
									      borderWidth: 1,
									      height: height / 12,
									      width: width / 3.9,
									      marginLeft: 10,
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
								      </CardItem>
							      </Body>
						      </Body>
					      </View>
					      {
						      this.state.price > 0
							      ?
							      <Content>
							      <Card style={{
								      borderWidth: 0,
								      borderColor: 'rgba(0,0,0,0)',
								      backgroundColor: 'rgba(0,0,0,0)',
								      shadowOffset: { height: 0, width: 0 },
								      shadowOpacity: 0,
								      elevation:0,
								      marginTop: 20,
							      }}>
								      <CardItem style={{
									      borderColor: '#d4d4d4',
									      borderRadius: 8,
									      borderWidth: 1,
									      height: height / 12,
									      width: width / 1.18,
									      marginLeft: 25,
								      }}>
									      <Body
										      style={{
											      flexDirection: 'row',
											      alignItems: 'center',
											      // justifyContent: 'flex-start',
										      }}>
									      <Left style={{
										      flexDirection: 'row',
										      alignItems: 'center',
									      }}>
										      <Icon
											      style={{ color: '#ed1368' }}
											      active
											      name='price-tag'
											      type='Entypo'
											      icon
										      />
										      <Text style={{
											      fontWeight: '100',
											      fontFamily: Fonts.GothamRounded,
											      color: '#b3b4b4',
											      fontSize: 16,
											      textAlign: 'center',
											      marginLeft: 15,
											    }}>
											      {this.state.price}
										      </Text>
									      </Left>
									      <Right>
										      {
											      this.state.price > this.state.user.wallet_amount
												      ?
												      <View
													      style={{
														      backgroundColor: '#d3000d',
														      flexDirection: 'row',
														      alignItems: 'center',
														      justifyContent: 'center',
														      width: 30,
														      height: 30,
														      borderRadius: 30/2,
														      marginRight: 10,
													      }}>
													      <Text style={{
														      fontWeight: '900',
														      fontFamily: Fonts.GothamRounded,
														      color: '#fff',
														      fontSize: 16.5,
														      marginTop: Platform.OS === 'ios' ? 5 : 0,
													      }}>!</Text>
												      </View>
												      :
												      <Icon
													      style={{ color: 'green', marginRight: 10, }}
													      active
													      name='ios-checkmark-circle'
													      type='Ionicons'
													      icon
												      />
										      }
									      </Right>
									      </Body>
								      </CardItem>
							      </Card>
								      {
									      this.state.price > 0
										      ?
										      <Button
											      style={{
												      width: width / 1.5,
												      marginLeft: width / 5.6,
												      marginTop: 20,
												      backgroundColor: '#ed1768',
												      borderRadius: 8
											      }}
											      onPress={this.state.price > this.state.user.wallet_amount ? this.navigateToWalletPage :this.submitRequest}
											      block
											      dark>
											      <Text style={{fontWeight: '900', fontFamily: Fonts.GothamRoundedLight}}>
												      { this.state.price > this.state.user.wallet_amount ? 'Load' : 'Moov' }
											      </Text>
										      </Button>
										      :
										      <View/>
								      }
							      </Content>
							      
							      : <Text/>
					      }
				
				      </View>
				      :
				      <View/>
		      }
		
		      {
			      this.state.driverDetails.image_url &&
			      <Content
				      contentContainerStyle={{
					      marginTop: height / 3,
					      height: height / 3.3,
				      }}
			      >
				      <Card
					      style={{
						      marginLeft: 15,
						      width: width / 1.08,
						      borderRadius: 8,
					      }}>
					
					      <CardItem style={{
						      borderRadius: 8,
						      // borderWidth: 1,
						      height: height / 5,
					      }}>
						      <Left
							      style={{
								      borderRadius: 10,
								      flexDirection: 'row',
								      alignItems: 'center',
								      width: width / 2
							      }}>
							      {
								      this.state.driverDetails.image_url &&
								      <Image
									      style={{
										      width: width / 5,
										      height: height / 9,
										      borderRadius: 8,
										      shadowOpacity: 0.75,
										      shadowRadius: 5,
										      shadowColor: '#b3b4b4',
										      shadowOffset: { height: 0, width: 0 },
									      }}
									      source={{
										      uri: `${this.state.driverDetails.image_url}`}}
								      />
							      }
							      <Body>
							      <Text
								      style={{
									      color: '#d3000d',
									      fontSize: Platform.OS === 'ios' ? 14 : 17,
									      fontWeight: '900',
									      fontFamily: Fonts.GothamRounded,
									      width: width / 3,
								      }}
							      >
								      {driverName}
							      </Text>
							      <Text
								      style={{
									      marginBottom: 5,
									      color: '#c5c5c5',
									      fontSize: Platform.OS === 'ios' ? 12 : 13,
									      fontWeight: '500',
									      fontFamily: Fonts.GothamRounded
								      }}
							      >
								      {
									      this.state.driverDetails.car_model
								      }
							      </Text>
							      <Rating
								      type="star"
								      // startingValue={3}
								      imageSize={12}
							      />
							      </Body>
							      <Right>
								      <Button
									      style={{
										      width: width / 3.7,
										      marginBottom: 10,
										      marginLeft: 10,
										      backgroundColor: '#ed1368',
										      borderRadius: 8
									      }}
									      // onPress={this.submitRequest}
									      block
									      dark>
									      {
										      this.state.loading
											      ? <ActivityIndicator
												      color='#fff'
												      size="large"
												      style={activityIndicator}
											      />
											      : <Text style={{fontSize: 12, fontWeight: '900', fontFamily: Fonts.GothamRoundedLight}}>Cancel ride</Text>
									      }
								      </Button>
							      </Right>
						      </Left>
					      </CardItem>
					
					      <CardItem style={{
						      borderWidth: 0.25,
						      height: height / 10,
						      borderTopColor: '#cbcbcb',
						      borderColor: '#fff',
						      flexDirection: 'row',
						      width: width / 1.2,
						      marginLeft: 15,
						      backgroundColor: 'rgba(0,0,0,0)',
						      borderLeftColor: 'rgba(0,0,0,0)',
					      }}>
						
						      <View
							      style={{
								      flexDirection: 'column',
								      // alignItems: 'center',
								      justifyContent: 'center',
								      width: width / 5,
								      height: height / 11.5,
								      backgroundColor: 'rgba(0,0,0,0)',
							      }}>
							      <Text
								      style={{
									      fontFamily: Fonts.GothamRoundedLight,
									      marginBottom: 5, color: '#b3b4b4',
									      fontSize: Platform.OS === 'ios' ? 7 :  9,
									      fontWeight: '700'
								      }}>
								      Phone Number
							      </Text>
							      <Text
								      style={{
									      marginBottom: 5,
									      color: '#d3000d',
									      fontSize: Platform.OS === 'ios' ? 7 : 9,
									      fontWeight: '600',
									      fontFamily: Fonts.GothamRoundedLight
								      }}
							      >{this.state.driverDetails.mobile_number}</Text>
						      </View>
						
						      <View
							      style={{
								      flexDirection: 'column',
								      // alignItems: 'center',
								      justifyContent: 'center',
								      marginLeft: 10,
								      width: width / 5,
								      height: height / 11.5,
								      backgroundColor: 'rgba(0,0,0,0)',
							      }}>
							      <Text
								      style={{
									      fontFamily: Fonts.GothamRoundedLight,
									      marginBottom: 5, color: '#b3b4b4',
									      fontSize: Platform.OS === 'ios' ? 7 :  9,
									      fontWeight: '700'
								      }}>
								      Estimated Time
							      </Text>
							      <Text
								      style={{
									      marginBottom: 5,
									      color: '#d3000d',
									      fontSize: Platform.OS === 'ios' ? 7 : 9,
									      fontWeight: '600',
									      fontFamily: Fonts.GothamRoundedLight
								      }}
							      >{this.state.driverTimeAway ? this.state.driverTimeAway : 'few mins'} away.</Text>
						      </View>
						
						      <View
							      style={{
								      flexDirection: 'column',
								      // alignItems: 'center',
								      justifyContent: 'center',
								      marginLeft: 10,
								      width: width / 5,
								      height: height / 11.5,
								      backgroundColor: 'rgba(0,0,0,0)',
							      }}>
							      <Text
								      style={{
									      fontFamily: Fonts.GothamRoundedLight,
									      marginBottom: 5, color: '#b3b4b4',
									      fontSize: Platform.OS === 'ios' ? 7 :  9,
									      fontWeight: '700'
								      }}>
								      Plate Number
							      </Text>
							      <Text
								      style={{
									      marginBottom: 5,
									      color: '#d3000d',
									      fontSize: Platform.OS === 'ios' ? 7 : 9,
									      fontWeight: '600',
									      fontFamily: Fonts.GothamRoundedLight
								      }}
							      >{
								      this.state.driverDetails.plate_number
							      }</Text>
						      </View>
						
						      <View
							      style={{
								      flexDirection: 'column',
								      // alignItems: 'center',
								      justifyContent: 'center',
								      marginLeft: 10,
								      width: width / 5,
								      height: height / 11.5,
								      backgroundColor: 'rgba(0,0,0,0)',
							      }}>
							      <Text
								      style={{
									      fontFamily: Fonts.GothamRoundedLight,
									      marginBottom: 5, color: '#b3b4b4',
									      fontSize: Platform.OS === 'ios' ? 7 :  9,
									      fontWeight: '700'
								      }}>
								      Payment
							      </Text>
							      <Text
								      style={{
									      marginBottom: 5,
									      color: '#d3000d',
									      fontSize: Platform.OS === 'ios' ? 7 : 9,
									      fontWeight: '600',
									      fontFamily: Fonts.GothamRoundedLight
								      }}
							      >WALLET</Text>
						      </View>
					
					      </CardItem>
				
				
				
				
				      </Card>
			      </Content>
		      }
		      
	      </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
	annotationContainer: {
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderRadius: 15,
	},
	annotationFill: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: 'orange',
		transform: [{ scale: 0.6 }],
	}
});

const layerStyles = {
	route: {
		lineColor: '#f76b1c',
		lineWidth: 5,
		lineOpacity: 0.3,
	},
};


export { Homepage }
