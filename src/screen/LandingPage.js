// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity, ActivityIndicator, Platform,
  Linking, AsyncStorage
} from 'react-native';

// third-part library
import FBSDK from 'react-native-fbsdk';
import { LoginManager } from 'react-native-fbsdk'
import Toast from 'react-native-simple-toast';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { Caption, Heading, Subtitle, Title } from '@shoutem/ui';

// commom
import { StatusBarComponent } from "../common";
import {SignInFormPage} from "../component";
import firebase from "firebase";
import * as axios from "axios/index";

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
    password: '',
    imgURL: '',
    loading: false,
    userAuthID: ''
  };

  /**
   * componentDidMount
   *
   * React life-cycle method
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
    LoginManager.logOut()
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
    Toast.show('Facebook signup was successful', Toast.LONG);
    console.log(userDetails);

    this.setState({
      firstName: userDetails.first_name,
      lastName: userDetails.last_name,
      email: userDetails.email,
      imgURL: userDetails.picture.data['url'],
      userAuthID: userDetails.id
    }, () => {
      this.signInToServer();
    });

    // this.appNavigation('number');
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

    if (page === 'Homepage') {
      navigate('MoovPages');
      this.setState({ loading: false })
    }

    if (page === 'signIn') {
      this.setState({ loading: false })
      navigate('SignInPage');
    }

    if (page === 'number') {
      this.setState({ loading: false })
      navigate('NumberFormPage', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        imgURL: this.state.imgURL,
        userAuthID: this.state.userAuthID
      });
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
      AsyncStorage.setItem('user', JSON.stringify(userDetails.data));
      this.appNavigation('Homepage');
    });

  };

  /**
   * checkErrorMessage
   *
   * checks error message from the server for right navigation
   * @param {string} message - Error message from server
   * @return {void}
   */
  checkErrorMessage = (message) => {
    if(message === 'User does not exist') {
      this.appNavigation('number');
    } else {
      console.log(message, 'check error');
      // this.setState({ loading: true });
      Toast.showWithGravity(`Login was unsuccessful`, Toast.LONG, Toast.TOP);
    }
  };

  /**
   * saveUserToServer
   *
   * login user using axios
   * @return {void}
   */
  signInToServer = () => {
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/login', {
      "email": this.state.email,
      "user_id": this.state.userAuthID,
    })
      .then((response) => {
        this.setState({ loading: !this.state.loading });
        console.log(response);
        console.log(response.data.data);
        this.saveUserToLocalStorage(response.data.data);
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.data.data.message);
        console.log(error.message);
        this.setState({ loading: !this.state.loading });
        this.checkErrorMessage(error.response.data.data.message);
      });
  };

  /**
   *
   */
  signInToFirebase = () => {
    this.setState({ loading: !this.state.loading });
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((response) => {
        console.log('called sdsdsd');
        console.log(response, 'After login');
        this.setState({
          userAuthID: response.uid,
        }, () => {
          this.signInToServer();
        });
      })
      .catch((error) => {
        console.log('called error');
        console.log(error, 'Login Error');
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${error.message}`, Toast.LONG, Toast.TOP);
      });
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
    if(this.validateFields()) {
      this.signInToFirebase()
    }
  };

  /**
   * resetPassword
   *
   * sends user reset email link
   * @return {void}
   */
  resetPassword = () => {
    console.log('called');

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
        <View style={{ flexDirection: 'column', width: width / 1.3 }}>

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
              <Title>Welcome</Title>
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

              buttonText='Sign In'
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
                  onLogoutFinished={() => alert("logout.")}/>
              </View>
              <View stle={{ justifyContent: 'center'}}>
                <GoogleSigninButton
                  style={{ width: '102%', height: 40, marginTop: 10 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Auto}
                  onPress={this.googleSignIn}/>
              </View>
            </View>
          </View>

          {/*Sign UP*/}
          <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'center'}}>
            <Caption style={{ textAlign: 'center', color: '#333333', fontSize: 10 }}>New to MOOV? Sign up with</Caption>
            <TouchableOpacity onPress={() => this.appNavigation('signup')}>
              <Caption style={{ textAlign: 'center', color: '#333', fontSize: 10, fontWeight: '700' }}> Email</Caption>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );

    // return (
    //   <View style={container}>
    //     <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
    //     <View style={{ alignItems: 'center'}}>
    //       <TouchableOpacity onPress={this.spring.bind(this)}>
    //         <Animated.Image
    //           style={{
    //             alignItems: 'center',
    //             height: height / 3.5,
    //             width: width / 2,
    //             transform: [{scale: this.springValue}],
    //             borderRadius: 25
    //           }}
    //           source={require('../../assets/appLogo.png')}
    //         />
    //       </TouchableOpacity>
    //     </View>
    //     <View style={landingPageBody}>
    //       {/*<TouchableOpacity onPress={() => this.appNavigation('signIn')} >*/}
    //         {/*<Text style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Sign In</Text>*/}
    //       {/*</TouchableOpacity>*/}
    //       <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
    //         <SignInFormPage
    //           emailValue={this.state.email}
    //           passwordValue={this.state.password}
    //
    //           onChangeEmailText={email => this.setState({ email })}
    //           onChangePasswordText={password => this.setState({ password })}
    //
    //           buttonText='Sign In'
    //           // onSubmit={() => this.submitForm()}
    //         />
    //         <TouchableOpacity onPress={() => this.appNavigation('signup')}>
    //           <Text style={[ signUpStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>New to MOOV? Sign up with</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity onPress={() => this.appNavigation('signup')}>
    //           <Text style={[ signUpStyle, emailText]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Email</Text>
    //         </TouchableOpacity>
    //       </View>
    //       <View style={{ flexDirection: 'column', justifyContent: 'center'}}>
    //         <View style={{ marginTop: 3, marginLeft: 4 }}>
    //           <LoginButton
    //             publishPermissions={["publish_actions email public_profile"]}
    //             onLoginFinished={
    //               (error, result) => {
    //                 if (error) {
    //                   alert("login has error: " + result.error);
    //                 } else if (result.isCancelled) {
    //                   alert("login is cancelled.");
    //                 } else {
    //                   AccessToken.getCurrentAccessToken().then(
    //                     (data) => {
    //                       this.getFacebookUser(data.accessToken);
    //                     }
    //                   )
    //                 }
    //               }
    //             }
    //             onLogoutFinished={() => alert("logout.")}/>
    //         </View>
    //          <View stle={{ justifyContent: 'center'}}>
    //            <GoogleSigninButton
    //             style={{ width: '102%', height: 40, marginTop: 10 }}
    //             size={GoogleSigninButton.Size.Wide}
    //             color={GoogleSigninButton.Color.Auto}
    //             onPress={this.googleSignIn}/>
    //         </View>
    //       </View>
    //     </View>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'white',
    // justifyContent: 'center',
    // height: Dimensions.get('window').height
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landingPageBody: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20%',
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
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
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