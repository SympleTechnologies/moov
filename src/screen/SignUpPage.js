// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';

// third-part library
import { Heading } from '@shoutem/ui';
import Toast from 'react-native-simple-toast';
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob'
import ImagePicker from 'react-native-image-picker';

// component
import { SignUpForm } from "../component";

// common
import { StatusBarComponent } from "../common";

// More info on all the options is below in the README...just some common use cases shown here
let options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

class SignUpPage extends React.Component {
  constructor(){
    super();
  }
  state= {
    stage: '1',
    isValidPhoneNumber: '',
    type: "",
    phoneNumber: "",
    isValidUserDetails: '',

    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errorMessage: '',

    shareLinkContent: {
      contentType: 'link',
      contentUrl: "https://symple.tech",
      contentDescription: 'Get mooving with MOOV!',
    },

    image_uri: '',
    loading: false,
    formComplete: true,
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
  }

  getImage = () => {

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {

        this.uploadImage(response.uri)
          .then(url => {
            alert('uploaded');
            this.setState({
              image_uri: url,
              loading: !this.state.loading
            }, () => {
              this.appNavigation();
            });

          })
          .catch(error => console.log(error));
      }
    });

  };

  uploadImage(uri, mime = 'application/octet-stream') {
    this.setState({ loading: !this.state.loading });

    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null;

      const imageRef = firebase.storage().ref('images').child(`pro-pic_${this.state.firstName}${this.state.email}`);

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = () => {
    const { navigate } = this.props.navigation;
    navigate('NumberFormPage', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      imgURL: this.state.image_uri,
    });
  };

  /**
   * validateFields
   *
   * validates user input fields
   * @return {boolean}
   */
  validateFields = () => {
    let hasNumber = /\d/;
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if ( this.state.firstName === '') {
      Toast.show('First Name field cannot be empty', Toast.LONG);
    } else if(format.test(this.state.firstName)){
      Toast.show('First Name field cannot special characters', Toast.LONG);
    } else if(hasNumber.test(this.state.firstName)) {
      Toast.show('First Name field cannot contains numbers', Toast.LONG);
    } else if ( this.state.lastName === '') {
      Toast.show('Last Name field cannot be empty', Toast.LONG);
    } else if(format.test(this.state.lastName)){
      Toast.show('Last Name field cannot special characters', Toast.LONG);
    } else if(hasNumber.test(this.state.lastName)) {
      Toast.show('Last Name field cannot contains numbers', Toast.LONG);
    } else if ( this.state.email === '') {
      Toast.show('Email field cannot be empty', Toast.LONG);
    } else if(this.state.email.match(pattern) === null) {
      Toast.show('Email address is badly formatted', Toast.LONG);
    } else if ( this.state.password === '' ) {
      Toast.show('Password field cannot be empty', Toast.LONG);
    } else if(this.state.password.length < 6) {
      Toast.show('Password cannot be less than 6 characters', Toast.LONG);
    } else if ( this.state.confirmPassword === '' ) {
      Toast.show('Confirm Password cannot be empty', Toast.LONG);
    } else if ( this.state.confirmPassword !== this.state.password ) {
      Toast.show('Password does not match the confirm password field', Toast.LONG);
    } else {
      return true
    }
  };

  /**
   * nextRegistrationForm
   *
   * moves user to next step in registration which is uploading picture
   */
  nextRegistrationForm = () => {
    if(this.validateFields()) {
      this.getImage();
    }
  };

  render() {
    const {
      container,
      progressBar,
      activityIndicator
    } = styles;
    let { height, width } = Dimensions.get('window');
    console.log(this.state);

    if(this.state.isValidPhoneNumber === false) {
      Toast.show('You have entered an invalid phone number.', Toast.LONG);
    }

    // ACTIVITY INDICATOR
    if (this.state.loading) {
      return (
        <View style={{flex: 1, backgroundColor: 'white' }}>
          <StatusBarComponent />
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
        <View style={{ height: height / 10}}>
          <Heading>Get MOOVING.</Heading>
        </View>
        <Image
          style={progressBar}
          source={require('../../assets/formA.png')}
        />
        <View>
          <SignUpForm
            firstNameValue={this.state.firstName}
            lastNameValue={this.state.lastName}
            emailValue={this.state.email}
            passwordValue={this.state.password}
            confirmPasswordValue={this.state.confirmPassword}
            onChangeFirstNameText={firstName => this.setState({ firstName })}
            onChangeLastNameText={lastName => this.setState({ lastName })}
            onChangeEmailText={email => this.setState({ email })}
            onChangePasswordText={password => this.setState({ password })}
            onChangeConfirmPasswordText={confirmPassword => this.setState({ confirmPassword })}
            onSubmit={() => this.nextRegistrationForm()}
          />
        </View>
      </View>
    )
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { SignUpPage };