// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet, View, TouchableOpacity, Dimensions, Animated, ActivityIndicator,
  AsyncStorage, Platform, ImageBackground, Image, ScrollView
} from 'react-native';

// third-party libraries
import FBSDK from 'react-native-fbsdk';
import { LoginManager } from 'react-native-fbsdk'
import * as axios from "axios/index";
import { GoogleSignin } from 'react-native-google-signin';
import { Content, Container, Text, Item, Input, Icon, Button, Toast } from 'native-base';

// common
import {StatusBarComponent} from "../common";

// Facebook
const { AccessToken } = FBSDK;
const { GraphRequest, GraphRequestManager } = FBSDK;

// fonts
import { Fonts } from "../utils/Font";
import {FirstPage} from "../component/Registration";

class SignInPage extends React.Component {

  /**
   * constructor
   */
  constructor () {
    super();
    this.springValue = new Animated.Value(0.3);
  }

  state = {
    firstName: '',
    lastName: '',
    email: '',
    socialEmail: '',
    password: '',
    imgURL: '',
    userAuthID: '',

    loading: false,
    authentication_type: '',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method
   * @return {void}
   */
  componentDidMount() {
    this.spring();
    LoginManager.logOut();
    this.googleSignOut();
    this.setupGoogleSignin().then();
  }

  /**
   * setupGoogleSignin
   *
   * Initialize google auth
   * @return {Promise<void>}
   */
  async setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });

      await GoogleSignin.configure({
        iosClientId: '365082073509-5071c4nc1306fh1mu7ka4hj0evhr85e4.apps.googleusercontent.com',
        webClientId: '365082073509-gekfqcg3ml1ucmj0li7id4c4o099deod.apps.googleusercontent.com',
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log(user);
    }
    catch (err) {
      console.log("Google signin error", err.code, err.message);
    }
  }

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
   * googleSignIn
   *
   * Signs user out using google login interface
   * @return {void}
   */
  googleSignOut = () => {
    GoogleSignin.signOut()
      .then(() => {
        console.log('out');
      })
      .catch((err) => {

      });
  };

  /**
   * signUpPage
   *
   * navigates to sign-up page
   * @return {void}
   */
  signUpPage = () => {
    const { navigate } = this.props.navigation;
    navigate('FirstPage');
  };

  /**
   * checkErrorMessage
   *
   * checks error message from the server for right navigation
   * @param {string} message - Error message from server
   * @return {void}
   */
  checkErrorMessage = (message) => {
    this.setState({ loading: !this.state.loading });
    if(message === 'User does not exist') {
      this.appNavigation('signUp');
    } else {
      LoginManager.logOut();
      this.errorMessage(`${message}`)
    }
  };

  /**
   * resetPassword
   *
   * sends user reset email link
   * @return {void}
   */
  resetPassword = () => {
    this.setState({ loading: !this.state.loading });
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/forgot_password', {
      "email": this.state.email,
    })
      .then((response) => {
        this.setState({ loading: !this.state.loading });
        this.successMessage(response.data.data.message)
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        this.errorMessage(error.response.data.data.message)
      });
  };

  /**
   * submitForm
   */
  submitForm = () => {
    if(this.validateFields()) {
      this.setState({ loading: !this.state.loading });
      this.signInWithEmailAndPassword();
    }
  };

  /**
   * validateFields
   *
   * validates user input fields
   * @return {boolean}
   */
  validateFields = () => {
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if ( this.state.email === '') {
      this.errorMessage("Email field cannot be empty");
    } else if(this.state.email.match(pattern) === null) {
      this.errorMessage("Email address is badly formatted");
    } else if ( this.state.password === '' ) {
      this.errorMessage("Password field cannot be empty");
    } else {
      return true
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
   * handleFacebookLogin
   *
   * handles user facebook login
   * @return {void}
   */
  handleFacebookLogin = () => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then((result) => {
        if (result.isCancelled) {
          console.log('Login cancelled')
        } else {
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              this.getFacebookUser(data.accessToken);
            })
            .catch((error) => {
              this.errorMessage('Unable to fetch user details!')
            })
        }
      },
      (error) => {
        console.log('Login fail with error: ' + error)
      }
    )
  };

  /**
   * getFacebookUser
   *
   * Get facebook user information
   * @param {string} token - user's access token
   * @return {void}
   */
  getFacebookUser = (token) => {
    this.setState({ loading: !this.state.loading });
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: token,
        parameters: {
          fields: {
            string: 'name,first_name,middle_name,last_name,picture,email'
          }
        }
      },
      this._responseInfoCallback
    );

    new GraphRequestManager().addRequest(infoRequest).start()

  };

  /**
   * _responseInfoCallback
   *
   * GraphRequest call back handler
   * @param {object} error - error containing error message
   * @param {object} result - object containg user information
   * @private
   * @return {void}
   */
  _responseInfoCallback = (error: ?Object, result: ?Object) => {
    if (error) {
      this.setState({ loading: !this.state.loading });
      this.errorMessage('The operation couldn’t be completed');
      LoginManager.logOut()
    } else {
      this.facebookLoginSucces(result);
    }
  };

  /**
   * facebookLoginSucces
   *
   * Sets the state with the user's details
   * @param {object} userDetails - User's information
   * @return {void}
   */
  facebookLoginSucces = (userDetails) => {
    this.setState({
      firstName: userDetails.first_name,
      lastName: userDetails.last_name,
      socialEmail: userDetails.email,
      imgURL: userDetails.picture.data['url'],
      userAuthID: userDetails.id,
      authentication_type: "facebok"
    }, () => {
      this.signInWithSocialAuth();
    });
  };

  /**
   * googleSignIn
   *
   * Signs user in using google login interface
   * @return {void}
   */
  googleSignIn = () => {
    this.setState({ loading: !this.state.loading });
    GoogleSignin.configure({
      iosClientId: '365082073509-5071c4nc1306fh1mu7ka4hj0evhr85e4.apps.googleusercontent.com'
    })
      .then(() => {
        GoogleSignin.signIn()
          .then((user) => {
            console.log(user);

            this.setState({
              firstName: user.givenName,
              lastName: user.familyName,
              socialEmail: user.email,
              imgURL: user.photo,
              userAuthID: user.id,
              authentication_type: "google"
            }, () => {
              this.googleSignOut();
              this.signInWithSocialAuth();
            });
            this.successMessage('Google signup was successful')
          })
          .catch((err) => {
            this.setState({ loading: !this.state.loading });
            this.errorMessage('Google sign-up was unsuccessful');
          })
          .done();
      })
  };

  /**
   * signInWithSocialAuth
   *
   * Sign in with Social media
   * @return {void}
   */
  signInWithSocialAuth = () => {
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/login', {
      "email": this.state.socialEmail,
      "password": this.state.userAuthID,
    })
      .then((response) => {
        this.successMessage(`${response.data.data.message}`)
        this.saveUserToLocalStorage(response.data.data);
      })
      .catch((error) => {
        this.checkErrorMessage(error.response.data.data.message);
      });
  };

  /**
   * signInWithEmailAndPassword
   *
   * Sign in with user's email and password
   * @return {void}
   */
  signInWithEmailAndPassword = () => {
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/login', {
      "email": this.state.email,
      "password": this.state.password,
    })
      .then((response) => {
        this.successMessage(response.data.data.message);
        this.saveUserToLocalStorage(response.data.data);
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        this.errorMessage(error.response.data.data.message)
      });
  };

  /**
   * saveUserToLocalStorage
   *
   * Saves user details to local storage
   * @param userDetails
   */
  saveUserToLocalStorage = (userDetails) => {
    AsyncStorage.setItem("token", userDetails.token);
    AsyncStorage.setItem('user', JSON.stringify(userDetails.data)).then(() => {
      this.appNavigation('Homepage');
    });
  };

  /**
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = (page) => {
    this.setState({ loading: !this.state.loading });
    const { navigate } = this.props.navigation;

    if (page === 'signup') {
      this.setState({ loading: !this.state.loading });
      // navigate('SignUpPage');
    }

    if (page === 'Homepage') {
      navigate('Homepage');
    }

    if (page === 'signIn') {
      navigate('SignInPage');
    }

    if (page === 'signUp') {
      navigate('SecondPage', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        socialEmail: this.state.socialEmail,
        imgURL: this.state.imgURL,
        userAuthID: this.state.userAuthID,
        authentication_type: this.state.authentication_type
      });
    }
  };

  render() {
    console.log(this.state)
    const { container, activityIndicator, welcomeText, backText } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <Container style={container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        <ImageBackground
          style={{
            height: height,
            width: width,
          }}
          source={require('../../assets/moovBG1.png')}
        >
          <Content contentContainerStyle={{ alignItems: 'center'}}>
            <TouchableOpacity onPress={this.spring}>
              <Animated.Image
                style={{
                  alignItems: 'center',
                  height: height / 6,
                  width: width / 3.5,
                  marginTop: height / 9,
                  transform: [{scale: this.springValue}],
                  borderRadius: 20
                }}
                source={require('../../assets/appLogo.png')}
              />
            </TouchableOpacity>
            <Content
              contentContainerStyle={{
                marginTop: height / 25,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text style={welcomeText}>Welcome</Text>
              <Text style={backText }> Back</Text>
            </Content>
            <ScrollView
              scrollEnabled={false} // the view itself doesn't scroll up/down (only if all fields fit into the screen)
              keyboardShouldPersistTaps='always' // make keyboard not disappear when tapping outside of input
              enableAutoAutomaticScroll={false}
              style={{
                marginLeft: width / 40,
                marginTop: height / 25,
                width: width / 1.5,
                borderWidth: 1,
                borderColor: '#b3b4b4',
                borderRadius: 10,
                backgroundColor: 'white'
              }}>
              <Item style={{ borderWidth: 1, borderColor: '#b3b4b4' }}>
                <Icon
                  style={{ marginLeft: width / 20, color: '#b3b4b4' }}
                  color={'b3b4b4'}
                  active name='ios-mail-outline'
                  type='Ionicons'
                />
                <Input
                  placeholder='Username/Email'
                  placeholderTextColor='#b3b4b4'
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                  autoCapitalize='none'
                  style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
                />
              </Item>
              <Item>
                <Icon
                  active
                  style={{ marginLeft: width / 20, color: '#b3b4b4' }}
                  name='user-secret'
                  type="FontAwesome"
                  returnKeyType='next'
                />
                <Input
                  placeholder='Password'
                  placeholderTextColor='#b3b4b4'
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                  autoCapitalize='none'
                  style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
                />
              </Item>
            </ScrollView>
            <Button
              style={{
                width: width / 1.5,
                marginLeft: width / 5.6,
                marginTop: height / 50,
                backgroundColor: '#ed1768',
              }}
              onPress={this.submitForm}
              block
              dark>
              {
                this.state.loading
                  ? <ActivityIndicator
                      color = '#fff'
                      size = "large"
                      style={activityIndicator}
                    />
                  : <Text style={{ fontWeight: '900', fontFamily: Fonts.GothamRoundedLight }}>Sign in</Text>
              }
            </Button>
            <Content
              style={{
                marginTop: height / 50,
              }}
            >
              <TouchableOpacity onPress={this.resetPassword}>
                <Text style={{ color: '#f00266', fontSize: 18, fontWeight: '300', fontFamily: Fonts.GothamRoundedLight }}>Forgot password</Text>
              </TouchableOpacity>
            </Content>
            <Content
              style={{
                marginTop: height / 50,
              }}
            >
              <Text style={{ color: '#b3b4b4', fontSize: 18, fontWeight: '400', fontFamily: Fonts.GothamRoundedLight }}>Sign in with</Text>
            </Content>
            <Content
              contentContainerStyle={{
                marginTop: height / 300,
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'space-around'
              }}
            >
              <Button
                onPress={this.handleFacebookLogin}
                iconLeft
                bordered
                style={{
                  borderWidth: 1,
                  width: width / 3.1,
                  marginLeft: width / 35,
                  marginTop: height / 50,
                  backgroundColor: '#ffffff',
                  borderColor: '#4065b4',
                  borderRadius: 12
                  // height:
                }}
                block
                dark>
                <Image
                  style={{
                    borderRadius: 10,
                    alignItems: 'center',
                    height: Platform.OS === 'ios' ? 43 : 43.5,
                    width: width / 11,
                    borderColor: 'red',
                    marginLeft: Platform.OS === 'ios' ? width / 35 : width / 70
                  }}
                  source={require('../../assets/facebook_logo.png')}
                />
                <Text style={{  color: '#4065b4', fontWeight: '900', fontSize: 13 }}>Facebook</Text>
              </Button>
              <Button
                onPress={this.googleSignIn}
                iconLeft
                bordered
                style={{
                  width: width / 3.1,
                  marginLeft: width / 40,
                  marginTop: height / 50,
                  backgroundColor: '#ffffff',
                  borderWidth: 2,
                  borderColor: '#b3b4b4',
                  borderRadius: 12
                }}
                block
                dark>
                <Image
                  style={{
                    borderRadius: 10,
                    alignItems: 'center',
                    height: height / 30,
                    width: width / 17,
                    marginLeft: width / 30,
                  }}
                  source={require('../../assets/google_logo.png')}
                />
                <View style={{
                  borderRadius: 35,
                  alignItems: 'center',
                  height: 45,
                  width: 10,
                  borderRightColor: '#b4b4b4',
                  borderLeftColor: 'white',
                  borderTopColor: '#b4b4b4',
                  borderBottomColor: '#b4b4b4',
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  // marginLeft: width / 70,

                  borderWidth: 1,
                }}/>
                <Text style={{ color: '#9b9b9b', fontWeight: '800', fontSize: 14, textAlign: 'center' }}>Google</Text>
              </Button>
            </Content>
            <Content
              contentContainerStyle={{
                marginTop: height / 25,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text style={{ color: '#9b9b9b', fontFamily: Fonts.GothamRounded }}>You don't have an account?</Text>
              <TouchableOpacity onPress={this.signUpPage}>
                <Text style={{ color: '#f00266', fontWeight: '900', fontFamily: Fonts.GothamRounded }}> Sign up</Text>
              </TouchableOpacity>
            </Content>
          </Content>
        </ImageBackground>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 20
  },
  welcomeText: {
    fontSize: 35, color: '#ffc653', fontWeight: '400', fontFamily: Fonts.GothamRounded
  },
  backText: {
    fontSize: 35, color: '#d3000d', fontWeight: '400', fontFamily: Fonts.GothamRounded
  }
});

export { SignInPage };
