// react libraries
import React from 'react';
import PropTypes from 'prop-types';

// react-native libraries
import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';

// third-part library
import FBSDK from 'react-native-fbsdk';
import { LoginManager } from 'react-native-fbsdk'
import Toast from 'react-native-simple-toast';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

// commom
import { StatusBarComponent } from "../common";
import {NumberFormPage} from "../component";

const {
  LoginButton,
  AccessToken,
} = FBSDK;

const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

class LandingPage extends React.Component {
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
    imgURL: '',
    loading: false,
  };

  /**
   * componentDidMount
   *
   * React life-cycle method
   * @return {void}
   */
  componentDidMount() {
    this.spring();
    this.setupGoogleSignin();
    this.googleSignOut();
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
        iosClientId: '1050975255216-bu201o7nb886rj65jmn190u0tn2c3tc6.apps.googleusercontent.com',
        webClientId: '1050975255216-bu201o7nb886rj65jmn190u0tn2c3tc6.apps.googleusercontent.com',
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
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = (page) => {
    this.setState({ loading: true })
    const { navigate } = this.props.navigation;

    if (page === 'signup') {
      navigate('SignUpPage');
      this.setState({ loading: false })
    }

    if (page === 'signIn') {
      navigate('SignInPage');
    }

    if (page === 'number') {
      navigate('NumberFormPage', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        imgURL: this.state.imgURL,
      });

      this.setState({ loading: false })
    }
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
  //Create response callback.
  _responseInfoCallback = (error: ?Object, result: ?Object) => {
    if (error) {
      console.log(error.toString(), 'Error from fb');
      console.log(error, 'Error from fb');
      Toast.show('The operation couldn’t be completed.', Toast.LONG);
      LoginManager.logOut()
    } else {
      console.log(result.toString(), 'Success from fb');
      console.log(result, 'Success from fb');
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
    Toast.show('Success.', Toast.LONG);
    console.log(userDetails);
    this.setState({
      firstName: userDetails.first_name,
      lastName: userDetails.last_name,
      email: userDetails.email,
      imgURL: userDetails.picture.data['url'],
    })
    this.appNavigation('number');
  };

  /**
   * getFacebookUser
   *
   * Get facebook user information
   * @param {string} token - user's access token
   * @return {void}
   */
  getFacebookUser = (token) => {
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
   * googleSignIn
   *
   * Signs user in using google login interface
   * @return {void}
   */
  googleSignIn = () => {
    GoogleSignin.configure({
      iosClientId: '1050975255216-bu201o7nb886rj65jmn190u0tn2c3tc6.apps.googleusercontent.com'
    })
      .then(() => {
        GoogleSignin.signIn()
          .then((user) => {
            console.log(user);
            this.setState({
              firstName: user.givenName,
              lastName: user.familyName,
              email: user.email,
              imgURL: user.photo,
            });

            Toast.show('Google signup was successful', Toast.LONG);
            this.appNavigation('number');
          })
          .catch((err) => {
            console.log('WRONG SIGNIN', err);
            console.log('WRONG SIGNIN', err.message);
            Toast.show('Google sign-up was unsuccessful', Toast.LONG);
          })
        .done();
      })
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

  render() {
    console.log(this.state, 'Entire state');
    const {
      container,
      landingPageBody,
      landingPageBodyText,
      signUpStyle,
      signInStyle,
      TextShadowStyle,
      emailText,
      activityIndicator
    } = styles;
    let { height, width } = Dimensions.get('window');

    // ACTIVITY INDICATOR
    if (this.state.loading) {
      return (
        <View style={{flex: 1}}>
          <StatusBarComponent />
          <ActivityIndicator
            color = '#004a80'
            size = "large"
            style={activityIndicator}
          />
        </View>
      );
    }

    return (
      <View style={container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <View style={{ alignItems: 'center'}}>
          <TouchableOpacity onPress={this.spring.bind(this)}>
            <Animated.Image
              style={{
                alignItems: 'center',
                height: height / 3.5,
                width: width / 2,
                transform: [{scale: this.springValue}],
                borderRadius: 25
              }}
              source={require('../../assets/appLogo.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={landingPageBody}>
          <TouchableOpacity onPress={() => this.appNavigation('signIn')} >
            <Text style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Sign In</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity onPress={() => this.appNavigation('signup')}>
              <Text style={[ signUpStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>New to MOOV? Sign up with</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.appNavigation('signup')}>
              <Text style={[ signUpStyle, emailText]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Email</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center'}}>
            <View style={{ marginTop: 3, marginLeft: 4 }}>
              <LoginButton
                publishPermissions={["publish_actions email public_profile"]}
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      alert("login has error: " + result.error);
                    } else if (result.isCancelled) {
                      alert("login is cancelled.");
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          this.getFacebookUser(data.accessToken);
                        }
                      )
                    }
                  }
                }
                onLogoutFinished={() => alert("logout.")}/>
            </View>
            <View stle={{ justifyContent: 'center'}}>
              <GoogleSigninButton
                style={{ width: width / 2.09, height: 40, marginTop: 10 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Auto}
                onPress={this.googleSignIn}/>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    height: Dimensions.get('window').height
  },
  landingPageBody: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20%',
  },
  landingPageBodyText: {
    color: '#b3b4b4',
    fontSize: 20,
    // borderWidth: 1,
    // borderColor: '#333',
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
    textDecorationLine: 'underline',
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
      // textShadowColor: '#ed1768',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,

    },
  signUpStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
    height: Dimensions.get('window').height / 10
    // width: Dimensions.get('window').width / 3,
  },
  emailText: {
    fontWeight: '700',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { LandingPage };
