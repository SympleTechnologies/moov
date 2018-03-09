// react libraries
import React from 'react';
var PropTypes = require('prop-types');

// react-native libraries
import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity } from 'react-native';

// third-part library
import { Icon } from '@shoutem/ui';
import FBSDK from 'react-native-fbsdk';
import { LoginManager } from 'react-native-fbsdk'
import Toast from 'react-native-simple-toast';

// commom
import { StatusBarComponent } from "../common";

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
    state = {
      firstName: '',
      lastName: '',
      email: '',
      imgURL: '',

    }
  }

  /**
   * componentDidMount
   *
   * React life-cycle method
   * @return {void}
   */
  componentDidMount() {
    this.spring();
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
    const { navigate } = this.props.navigation;

    if (page === 'signup') {
      navigate('SignUpPage');
    }

    if (page === 'signIn') {
      navigate('SignInPage');
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

  render() {
    console.log(this.state, 'Entire state');
    const {
      container,
      landingPageBody,
      landingPageBodyText,
      signUpStyle,
      signInStyle,
      TextShadowStyle,
      emailText
    } = styles;
    let { height, width } = Dimensions.get('window');

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
          <View>
            <LoginButton
              publishPermissions={["publish_actions"]}
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
  }
});

export { LandingPage };
