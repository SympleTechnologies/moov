// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet, View, TouchableOpacity, Dimensions, Animated, ActivityIndicator,
  AsyncStorage
} from 'react-native';

// third-party libraries
import FBSDK from 'react-native-fbsdk';
import { LoginManager } from 'react-native-fbsdk'
import Toast from 'react-native-simple-toast';
import * as axios from "axios/index";
import { Caption, Subtitle, Title } from '@shoutem/ui';

// common
import {StatusBarComponent} from "../common";

// component
import { SignInFormPage } from "../component";

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

  state = {
    firstName: '',
    lastName: '',
    email: '',
    socialEmail: '',
    imgURL: '',
    userAuthID: '',

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
    LoginManager.logOut();
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
      Toast.show('The operation couldn’t be completed.', Toast.LONG);
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
    console.log('success')
    this.setState({
      firstName: userDetails.first_name,
      lastName: userDetails.last_name,
      socialEmail: userDetails.email,
      imgURL: userDetails.picture.data['url'],
      userAuthID: userDetails.id,
    }, () => {
      this.signInWithSocialAuth();
    });
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
        this.saveUserToLocalStorage(response.data.data);
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
      })
      .catch((error) => {
        this.checkErrorMessage(error.response.data.data.message);
      });
  };

  /**
   * saveUserToLocalStorage
   *
   * Saves user details to local storage
   * @param userDetails
   */
  saveUserToLocalStorage = (userDetails) => {
    AsyncStorage.setItem("token", userDetails.token).then(() => {
      AsyncStorage.setItem('user', JSON.stringify(userDetails.data));
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
      navigate('SignUpPage');
    }

    if (page === 'Homepage') {
      navigate('MoovPages');
    }

    if (page === 'signIn') {
      navigate('SignInPage');
    }

    if (page === 'number') {
      navigate('NumberFormPage', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        socialEmail: this.state.socialEmail,
        imgURL: this.state.imgURL,
        userAuthID: this.state.userAuthID
      });
    }
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
      this.appNavigation('number');
    } else {
      LoginManager.logOut();
      Toast.showWithGravity(`${message}`, Toast.LONG, Toast.TOP);
    }
  };


  render() {

    const { container, activityIndicator } = styles;
    let { height, width } = Dimensions.get('window');


    // ACTIVITY INDICATOR
    if (this.state.loading) {
      return (
        <View style={{flex: 1, backgroundColor: 'white' }}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
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

        {/*Logo*/}
        <View style={{ alignItems: 'center', marginBottom: height / 15}}>
          <TouchableOpacity onPress={this.spring.bind(this)}>
          <Animated.Image
          style={{
          alignItems: 'center',
          height: height / 10,
          width: width / 5,
          transform: [{scale: this.springValue}],
          borderRadius: 15
          }}
          source={require('../../assets/appLogo.png')}
          />
          </TouchableOpacity>
        </View>

        {/*Title*/}
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <View>
            <Title>Sign In</Title>
          </View>
          <View style={{ marginTop: height / 20, marginBottom: height / 40}}>
            <Subtitle style={{ color: '#b3b4b4' }}>Sign in and get mooving with MOOV.</Subtitle>
          </View>
        </View>


        {/* Social Auth*/}
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
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
  },
  activityIndicator: {
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 20
  },
});

export { SignInPage };