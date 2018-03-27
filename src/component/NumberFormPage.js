// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

// third-party libraries
import { Heading, Subtitle, Icon } from '@shoutem/ui';
import PhoneInput from "react-native-phone-input";
import * as axios from 'axios';
import Toast from 'react-native-simple-toast';

// common
import { StatusBarComponent } from "../common";

class NumberFormPage extends React.Component {
  state= {
    isValidPhoneNumber: '',
    type: '',
    phoneNumber: '',

    firstName: '',
    lastName: '',
    email: '',
    password: '',
    imgURL: '',
    userAuthID: '',

    loading: false,

    userCreated: false,
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.setState({
      firstName: this.props.navigation.state.params.firstName,
      lastName: this.props.navigation.state.params.lastName,
      email: this.props.navigation.state.params.email,
      password: this.props.navigation.state.params.password,
      imgURL: this.props.navigation.state.params.imgURL,
      userAuthID: this.props.navigation.state.params.userAuthID,
    })
  }

  /**
   * shareLinkWithShareDialog
   *
   * Allows user share on facebook
   */
  shareLinkWithShareDialog = () => {
    let tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent).then(
      function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      }
    ).then(
      function(result) {
        if (result.isCancelled) {
          alert('Share cancelled');
        } else {
          alert('Share success with postId: '
            + result.postId);
        }
      },
      function(error) {
        alert('Share fail with error: ' + error);
      }
    );
  };

  /**
   * updateInfo
   *
   * Updates phone number details
   * @return {void}
   */
  updateInfo = () => {
    this.setState({ loading: !this.state.loading });
    this.setState({
      isValidPhoneNumber: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      phoneNumber: this.phone.getValue()
    }, () => {
      this.createUser()
    });
  };

  /**
   * createUser
   *
   * Creates user in the databse
   * @return {void}
   */
  createUser = () => {
    return this.state.isValidPhoneNumber
      ? this.checkTypeOfAccount()
      : Toast.showWithGravity('The number supplied is invalid', Toast.LONG, Toast.TOP);
  };

  /**
   *checkTypeOfAccount
   *
   * Checks for account type, e.g Social auth or email
   */
  checkTypeOfAccount = () => {
    if(this.state.userAuthID) {
      this.signUpWithSocialAuth();
    } else {
      this.signUpWithEmailAndPassword();
    }
  };

  /**
   * saveUserToLocalStorage
   *
   * Saves user details to local storage
   * @param userDetails
   */
  saveUserToLocalStorage = (userDetails) => {
    console.log(userDetails);
    AsyncStorage.setItem("token", userDetails.token).then(() => {
      AsyncStorage.setItem('user', JSON.stringify(userDetails.user))
    });

  };

  /**
   * signUpWithSocialAuth
   *
   * signs up users using social auth
   * @return {void}
   */
  signUpWithSocialAuth  = () => {
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/signup', {
      "password": this.state.userAuthID,
      "user_type": "student",
      "firstname":  this.state.firstName ,
      "lastname": this.state.lastName,
      "email": this.state.email,
      "mobile_number": this.state.phoneNumber
    })
      .then((response) => {
        this.setState({ loading: !this.state.loading, userCreated: !this.state.userCreated });
        console.log(response);
        alert(`${response.data.data.message}`);
        console.log(response.data.data);
        this.saveUserToLocalStorage(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.data.data.message);
        alert(`${error.response.data.data.message}`);
        console.log(error.message);
        this.setState({ loading: !this.state.loading });
      });
  };

  /**
   * signUpWithEmailAndPassword
   *
   * signs up users using email and password
   * @return {void}
   */
  signUpWithEmailAndPassword  = () => {
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/signup', {
      "password": this.state.password,
      "user_type": "student",
      "firstname":  this.state.firstName ,
      "lastname": this.state.lastName,
      "email": this.state.email,
      "mobile_number": this.state.phoneNumber
    })
      .then((response) => {
        this.setState({ loading: !this.state.loading, userCreated: !this.state.userCreated });
        console.log(response);
        alert(`${response.data.data.message}`);
        console.log(response.data.data);
        this.saveUserToLocalStorage(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.data.data.message);
        alert(`${error.response.data.data.message}`);
        console.log(error.message);
        this.setState({ loading: !this.state.loading });
      });
  };

  /**
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = () => {
    console.log('navigate');
    const { navigate } = this.props.navigation;
    navigate('MoovPages');
  };

  render() {
    console.log(this.state);
    const {
      container,
      progressBar,
      stageTwoStyle,
      landingPageBodyText,
      signInStyle,
      TextShadowStyle,
      activityIndicator
    } = styles;

    let { height, width } = Dimensions.get('window');

    // ACTIVITY INDICATOR
    if (this.state.loading) {
      return (
        <View style={{flex: 1}}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
          <ActivityIndicator
            color = '#004a80'
            size = "large"
            style={activityIndicator}
          />
        </View>
      );
    }

    if(this.state.userCreated) {
      return (
        <View style={container}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <View style={{ height: height / 20}}>
            <Heading>One click away.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../assets/formC.png')}
          />
          <View>
            <View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
              </View>
              <View style={{ height: height / 5, width: width / 1.5}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Icon name="share-android" />
                  <Text style={{ fontSize: 20 }}>For a free ride</Text>
                  <TouchableOpacity>
                    <Icon style={{ color: '#1ea1f2'}} name="tweet" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.shareLinkWithShareDialog}>
                    <Icon style={{ color: '#4266b2'}} name="facebook" color='blue'/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
                <TouchableOpacity onPress={this.appNavigation}>
                  <Text style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>No Thanks</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
        <View style={{ height: height / 10}}>
          <Heading>Get MOOVING.</Heading>
        </View>
        <Image
          style={progressBar}
          source={require('../../assets/formB.png')}
        />
        <View>
          <View>
            <View style={{ height: height / 15, alignItems: 'center'}}>
              <Subtitle>Enter your phone number:</Subtitle>
            </View>
            <View style={{ height: height / 5, width: width / 1.5}}>
              <View style={stageTwoStyle}>
                <PhoneInput
                  ref={ref => {
                    this.phone = ref;
                  }}
                  autoFocus
                />
              </View>
            </View>
            <TouchableOpacity style={{ alignItems: 'center'}} onPress={this.updateInfo}>
              <Text style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height
  },
  progressBar: {
    width: Dimensions.get('window').width / 1,
    height: Dimensions.get('window').height / 10
  },
  stageTwoStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff',
    padding: 20,
  },
  landingPageBody: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20%',
    textAlign: 'center'
  },
  landingPageBodyText: {
    color: '#b3b4b4',
    fontSize: 20,
    borderRadius: 15,
    padding: 8,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 3,
  },
  signInStyle: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    // textDecorationLine: 'underline',
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { NumberFormPage };