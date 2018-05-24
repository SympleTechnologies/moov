// react library
import React, { Component } from 'react';

// react-native library
import {
  AsyncStorage,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Animated, ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';

// third-party library
import { Container, Toast, Content, Text, Button } from 'native-base';
import PhoneInput from "react-native-phone-input";

// common
import { StatusBarComponent } from "../../common";
import { Fonts } from "../../utils/Font";
import * as axios from "axios/index";

class FinalPage extends Component {

  state={
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    imgURL: '',
    socialEmail: '',
    userAuthID: '',
    authentication_type: '',
    selectedSchool: '',

    isValidPhoneNumber: '',
    type: '',
    phoneNumber: '',

    loading: false
  };

  /**
   * onValueChange
   *
   * sets the selected school
   * @param value
   */
  onValueChange(value) {
    this.setState({
      selectedSchool: value
    });
  }

  /**
   * constructor
   */
  constructor () {
    super();
    this.springValue = new Animated.Value(0.3);
  }

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.spring();

    this.setState({
      firstName: this.props.navigation.state.params.firstName,
      lastName: this.props.navigation.state.params.lastName,
      email: this.props.navigation.state.params.email,
      password: this.props.navigation.state.params.password,
      imgURL: this.props.navigation.state.params.imgURL,
      socialEmail: this.props.navigation.state.params.socialEmail,
      userAuthID: this.props.navigation.state.params.userAuthID,
      authentication_type: this.props.navigation.state.params.authentication_type,
      selectedSchool: this.props.navigation.state.params.selectedSchool,
    })
  };

  /**
   * spring
   *
   * Animates app icon
   * @returns {void}
   */
  spring = () => {
    this.springValue.setValue(0.1);
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1
      }
    ).start()
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
    if(this.state.isValidPhoneNumber){
      this.checkTypeOfAccount();
      this.setState({ isValidPhoneNumber: false })
    }

    if(this.state.isValidPhoneNumber === false) {
      this.setState({ isValidPhoneNumber: false, loading: !this.state.loading});
      this.errorMessage('The number supplied is invalid')
    }
  };

  /**
   * errorMessage
   *
   * displays error message to user using toast
   * @param errorMessage
   * return {void}
   */
  errorMessage = (errorMessage) => {
    Toast.show({ text: `${errorMessage}`, type: "danger", position: 'top' })
  };

  /**
   * successMessage
   *
   * displays success message to user using toast
   * @param successMessage
   * return {void}
   */
  successMessage = (successMessage) => {
    Toast.show({ text: `${successMessage}`, type: "success", position: 'top' })
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
      "email": this.state.socialEmail,
      "image_url": this.state.imgURL,
      "mobile_number": this.state.phoneNumber,
      "school": this.state.selectedSchool,
      "authentication_type": this.state.authentication_type
    })
      .then((response) => {
        this.setState({ loading: !this.state.loading, userCreated: !this.state.userCreated });
        this.successMessage(`${response.data.data.message}`)
        this.saveUserToLocalStorage(response.data.data);
      })
      .catch((error) => {
        this.errorMessage(`${error.response.data.data.message}`)
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
      "mobile_number": this.state.phoneNumber,
      "school": this.state.selectedSchool,
      "authentication_type": this.state.authentication_type
    })
      .then((response) => {
        this.setState({ loading: !this.state.loading, userCreated: !this.state.userCreated });
        this.successMessage(`${response.data.data.message}`);
        this.saveUserToLocalStorage(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        this.errorMessage(`${error.response.data.data.message}`);
        this.setState({ loading: !this.state.loading });
      });
  };

  /**
   * saveUserToLocalStorage
   *
   * Saves user details to local storage
   * @param userDetails
   */
  saveUserToLocalStorage = (userDetails) => {
    const { navigate } = this.props.navigation;
    AsyncStorage.setItem('user', JSON.stringify(userDetails.user))
    AsyncStorage.setItem("token", userDetails.token).then(() => {
      this.appNavigation();
    });
  };

  /**
   * appNavigation
   *
   * navigates user to MOOV Homepage
   * @return {void}
   */
  appNavigation = () => {
    const { navigate } = this.props.navigation;
    navigate('MoovPages');
  };

  render() {
    const { container, getText, moovingText, activityIndicator } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <Container style={container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        <ImageBackground
          style={{
            height: height,
            width: width,
          }}
          source={require('../../../assets/moovBG1.png')}
        >
          <Content contentContainerStyle={{ alignItems: 'center'}}>
            <TouchableOpacity onPress={this.spring}>
              <Animated.Image
                style={{
                  alignItems: 'center',
                  height: height / 10.4,
                  width: width / 5.4,
                  marginTop: Platform.OS === 'ios' ? height / 9 : height / 10,
                  transform: [{scale: this.springValue}],
                  borderRadius: 10
                }}
                source={require('../../../assets/appLogo.png')}
              />
            </TouchableOpacity>
            <Content
              contentContainerStyle={{
                marginTop: height / 25,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text style={getText}>Let's</Text>
              <Text style={moovingText}> moov!</Text>
            </Content>
            <Content
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: width / 1.3,
              }}>
              <Content
                contentContainerStyle={{
                  borderWidth: 0.9,
                  borderColor: '#ffc653',
                  marginTop: 10,
                  marginBottom: 10,
                  width: width / 1.4
                }}>
              </Content>
              <Button
                style={{
                  marginTop: 10,
                  backgroundColor: '#fff',
                  shadowOpacity: 0.75,
                  shadowColor: '#b3b4b4',
                  shadowOffset: { height: 0, width: 0 },
                  borderColor: '#b3b4b4',
                  borderWidth: 0.2,
                  marginBottom: 10,
                  marginRight: 5,
                }}>
                <Text style={{ color: '#ffc653', fontWeight: '800', }}>3</Text>
              </Button>
            </Content>
            <Content
              contentContainerStyle={{
                height: height / 2.5,
                alignItems: 'center'
              }}>
              <Content
                contentContainerStyle={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Text
                  style={{
                    marginTop: height / 8,
                    color: '#b3b4b4',
                    fontFamily: Fonts.GothamRoundedLight,
                    fontWeight: '100',
                  }}
                >Enter Mobile Phone Number</Text>
                <Content
                  contentContainerStyle={{
                    marginTop: 20,
                    borderWidth: 1,
                    borderColor: '#b3b4b4',
                    width: width / 1.5,
                    height: height / 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ScrollView
                    contentContainerStyle={{
                      marginLeft: 10
                    }}>
                    <PhoneInput
                      ref={ref => {
                        this.phone = ref;
                      }}
                      initialCountry='ng'
                      autoFocus
                      allowZeroAfterCountryCode
                      textProps={{ placeholder: 'Telephone number' }}
                    />
                  </ScrollView>
                </Content>
              </Content>
            </Content>
            <Button
              style={{
                width: width / 1.5,
                marginLeft: width / 5.6,
                marginTop: 20,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#d3000d',
              }}
              onPress={this.updateInfo}
              block
              dark>
              {
                this.state.loading
                  ?
                  <ActivityIndicator
                    color = '#d3000d'
                    size = "large"
                    style={activityIndicator}
                  />
                  :
                  <Text style={{ color: '#d3000d', fontWeight: '900', fontFamily: Fonts.GothamRoundedLight }}>
                    Next
                  </Text>
              }
            </Button>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getText: {
    fontSize: 35, color: '#ffc653', fontWeight: '400', fontFamily: Fonts.GothamRounded
  },
  moovingText: {
    fontSize: 35, color: '#d3000d', fontWeight: '400', fontFamily: Fonts.GothamRounded
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { FinalPage }
