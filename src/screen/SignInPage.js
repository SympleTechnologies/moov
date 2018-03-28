// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

// third-party libraries
import { StatusBarComponent } from "../common";
import { Caption, Subtitle, Title } from '@shoutem/ui';
import Toast from 'react-native-simple-toast';
import * as axios from "axios/index";
import FBSDK from 'react-native-fbsdk';
import { LoginManager } from 'react-native-fbsdk'

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

  state = {
    email: '',
    password: '',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method
   * @return {void}
   */
  componentDidMount() {
    LoginManager.logOut();
  }

  /**
   * resetPassword
   *
   * sends user reset email link
   * @return {void}
   */
  resetPassword = () => {
    console.log('called');
    this.setState({ loading: !this.state.loading });
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/forgot_password', {
      "email": this.state.email,
    })
      .then((response) => {
        console.log(response.data.data);
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
      })
      .catch((error) => {
        console.log(error.response.data);
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
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
        console.log(response.data.data);
        this.saveUserToLocalStorage(response.data.data);
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
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
      Toast.showWithGravity('Email field cannot be empty', Toast.LONG, Toast.TOP);
    } else if(this.state.email.match(pattern) === null) {
      Toast.showWithGravity('Email address is badly formatted', Toast.LONG, Toast.TOP);
    } else if ( this.state.password === '' ) {
      Toast.showWithGravity('Password field cannot be empty', Toast.LONG, Toast.TOP);
    } else {
      return true
    }
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
        console.log(response.data.data);
        this.saveUserToLocalStorage(response.data.data);
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
      })
      .catch((error) => {
        console.log(error.response.data.data);
        // this.checkErrorMessage(error.response.data.data.message);
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

        {/*Title*/}
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <View>
            <Title>Sign In</Title>
          </View>
          <View style={{ marginTop: height / 20, marginBottom: height / 40}}>
            <Subtitle style={{ color: '#b3b4b4' }}>Sign in and get mooving with MOOV.</Subtitle>
          </View>
        </View>

        {/*Sign-In form*/}
        <View style={{ marginBottom: height / 25 }}>
          <SignInFormPage
            emailValue={this.state.email}
            passwordValue={this.state.password}

            onChangeEmailText={email => this.setState({ email })}
            onChangePasswordText={password => this.setState({ password })}

            buttonText='Submit'
            onSubmit={() => this.submitForm()}
          />
          <TouchableOpacity onPress={this.resetPassword}>
            <Caption style={{ textAlign: 'center', color: 'red', fontSize: 10 }}>Forgot password</Caption>
          </TouchableOpacity>
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
                onLogoutFinished={() => console("logout.")}/>
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