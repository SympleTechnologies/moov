// react libraries
import React from 'react';

// react-native libraries
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated} from 'react-native';

// third-party libraries
import * as axios from "axios/index";
import Toast from "react-native-simple-toast";
import { Caption, Heading, Subtitle } from '@shoutem/ui';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK, {LoginManager} from 'react-native-fbsdk';

// common
import {StatusBarComponent} from "../common";

// component
import {SignInFormPage} from "../component";

const {
  LoginButton,
  AccessToken,
} = FBSDK;

const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

class SignInPage extends React.Component {
  /**
   * constructor
   */
  constructor () {
    super();
    this.springValue = new Animated.Value(0.3);
  }

  state= {
    userToken: '',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.spring();
    this.googleSignOut();
    this.setupGoogleSignin();
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
   * _responseInfoCallback
   *
   * GraphRequest call back handler
   * @param {object} error - error containing error message
   * @param {object} result - object containg user information
   * @private
   * @return {void}
   */
    // Create response callback.
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
      userAuthID: userDetails.id
    });

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
   * googleSignIn
   *
   * Signs user in using google login interface
   * @return {void}
   */
  googleSignIn = () => {
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
              email: user.email,
              imgURL: user.photo,
              userAuthID: user.id
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

  render() {
    console.log(this.state);

    const { container } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View style={container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
          <TouchableOpacity onPress={this.spring.bind(this)}>
            <Animated.Image
              style={{
                alignItems: 'center',
                height: height / 3.5,
                width: width / 2,
                transform: [{scale: this.springValue}],
                borderRadius: 25,
                marginBottom: 10,
              }}
              source={require('../../assets/appLogo.png')}
            />
          </TouchableOpacity>
          <View style={{ marginTop: 30}}>
            {/*<Heading>Here to MOOV ?</Heading>*/}
            {/*<Heading>Here to MOOV ?</Heading>*/}
            {/*<Subtitle>Welcome back</Subtitle>*/}
          </View>
          <View style={{ marginTop: 10 }}>
            <SignInFormPage />
            <TouchableOpacity onPress={() => console.log('forget password')}>
              <Caption style={{ textAlign: 'center', color: 'red', fontSize: 10, marginBottom: 30 }}>Forgot Password</Caption>
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', alignItems: 'center'}}>
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
                  style={{ width: 200, height: 40, marginTop: 10 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Auto}
                  onPress={this.googleSignIn}/>
              </View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b3b4b4',
  },
});

export { SignInPage };