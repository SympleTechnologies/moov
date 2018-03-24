// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, ActivityIndicator,
  AsyncStorage
} from 'react-native';

// third-party libraries
import * as axios from "axios/index";
import Toast from "react-native-simple-toast";
import { Caption, Heading, Subtitle } from '@shoutem/ui';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK, {LoginManager} from 'react-native-fbsdk';
import firebase from 'firebase';

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
    email: '',
    password: '',
    userAuthID: '',
    loading: false,
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: "AIzaSyDeLqj8WPs8ZDhw6w2F2AELIwrzpkzuDhM",
        authDomain: "moov-project.firebaseapp.com",
        databaseURL: "https://moov-project.firebaseio.com",
        projectId: "moov-project",
        storageBucket: "moov-project.appspot.com",
        messagingSenderId: "365082073509"
      });
    }

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
      email: userDetails.email,
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

  // /**
  //  * appNavigation
  //  *
  //  * @param {string} page - The page the user wants to navigate to
  //  * @return {void}
  //  */
  // appNavigation = () => {
  //   console.log('navigate');
  //   const { navigate } = this.props.navigation;
  //   navigate('MoovHomepage');
  // };

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
              email: user.email,
              userAuthID: user.id
            }, () => {
              this.signInToServer();
            });

            Toast.show('Google signup was successful', Toast.LONG);
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
    } else {
      return true
    }
  };

  /**
   *
   */
  submitForm = () => {
    console.log('called sub')
    if(this.validateFields()) {
      this.signInToFirebase()
    }
  };

  // /**
  //  *
  //  */
  // signInToFirebase = () => {
  //   this.setState({ loading: !this.state.loading });
  //   console.log('called fb');
  //   firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
  //     .then((response) => {
  //       console.log('called sdsdsd');
  //       console.log(response, 'After login');
  //       this.setState({
  //         userAuthID: response.uid,
  //       }, () => {
  //         this.signInToServer();
  //       });
  //     })
  //     .catch((error) => {
  //       console.log('called error');
  //       console.log(error, 'Login Error');
  //       this.setState({ loading: !this.state.loading });
  //       Toast.showWithGravity(`${error.message}`, Toast.LONG, Toast.TOP);
  //     });
  // };

  // /**
  //  * saveUserToLocalStorage
  //  *
  //  * Saves user details to local storage
  //  * @param userDetails
  //  */
  // saveUserToLocalStorage = (userDetails) => {
  //   console.log(userDetails);
  //   AsyncStorage.setItem("token", userDetails.token).then(() => {
  //     AsyncStorage.setItem('user', JSON.stringify(userDetails.data));
  //     this.appNavigation();
  //   });
  //
  // };

  // /**
  //  * saveUserToServer
  //  *
  //  * login user using axios
  //  * @return {void}
  //  */
  // signInToServer = () => {
  //   axios.post('https://moov-backend-staging.herokuapp.com/api/v1/login', {
  //     "email": this.state.email,
  //   })
  //     .then((response) => {
  //       this.setState({ loading: !this.state.loading });
  //       console.log(response);
  //       console.log(response.data.data);
  //       this.saveUserToLocalStorage(response.data.data);
  //       Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
  //     })
  //     .catch((error) => {
  //       this.setState({ loading: !this.state.loading });
  //       console.log(error.response.data);
  //       console.log(error.response.data.data.message);
  //       alert(`${error.response.data.data.message}`);
  //       console.log(error.message);
  //       Toast.showWithGravity(`${error.message}`, Toast.LONG, Toast.TOP);
  //     });
  // };

  /**
   * resetPassword
   *
   * sends user reset email link
   * @return {void}
   */
  resetPassword = () => {
    console.log('called')

    firebase.auth().sendPasswordResetEmail(this.state.email).then((response) => {
      Toast.showWithGravity(`Check your email`, Toast.LONG, Toast.TOP);
    }).catch((error) => {
      // An error happened.
      console.log(error)
      console.log(error.message)
      Toast.showWithGravity(`${error.message}`, Toast.LONG, Toast.TOP);
    });
  };

  render() {
    console.log(this.state);

    const { container, activityIndicator } = styles;
    let { height, width } = Dimensions.get('window');


    if (this.state.loading) {
      return (
        <View style={{flex: 1, backgroundColor: 'white' }}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <ActivityIndicator
            color = '#f68d65'
            size = "large"
            style={activityIndicator}
          />
        </View>
      );
    }

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
            <SignInFormPage
              emailValue={this.state.email}
              passwordValue={this.state.password}

              onChangeEmailText={email => this.setState({ email })}
              onChangePasswordText={password => this.setState({ password })}

              buttonText='Sign In'
              onSubmit={() => this.submitForm()}
            />
            <TouchableOpacity onPress={this.resetPassword}>
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
  activityIndicator: {
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 20
  },
});

export { SignInPage };