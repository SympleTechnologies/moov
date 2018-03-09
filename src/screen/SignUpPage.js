// react libraries
import React from 'react';

// react-native libraries
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, Linking } from 'react-native';

// third-part library
import PhoneInput from "react-native-phone-input";
import { Heading, Subtitle, Button, Icon, Title } from '@shoutem/ui';
import Toast from 'react-native-simple-toast';
import FBSDK from 'react-native-fbsdk';

const {
  ShareDialog,
} = FBSDK;

// common
import {StatusBarComponent, ButtonComponent, Input, ButtonIconComponent} from "../common";
import {SignUpForm} from "../component";

class SignUpPage extends React.Component {
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
      contentUrl: "https://facebook.com",
      contentDescription: 'Wow, check out this great site!',
    },
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {

  }

  /**
   * updateInfo
   *
   * Updates phone number details
   * @return {void}
   */
  updateInfo = () => {
    this.setState({
      isValidPhoneNumber: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      phoneNumber: this.phone.getValue()
    });
  };

  renderInfo() {
    if (this.state.phoneNumber) {
      return (
        <View style={styles.info}>
          <Text>
            Is Valid:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {this.state.isValidPhoneNumber.toString()}
            </Text>
          </Text>
          <Text>
            Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
          </Text>
          <Text>
            Value:{" "}
            <Text style={{ fontWeight: "bold" }}>{this.state.phoneNumber}</Text>
          </Text>
        </View>
      );
    }
  }

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
   * onSubmit
   */
  onSubmit = () => {
    if(this.validateFields()) {
      this.setState({ errorMessage: '' });
      this.setState({ isValidUserDetails: true })
    }
  };

  // Share the link using the share dialog.
  shareLinkWithShareDialog = () => {
    let tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent).then(
      function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      }
    ).then(
      function(result) {
        if (result.isCancelled) {
          alert('Share cancelled');
        } else {
          alert('Share success with postId: '
            + result.postId);
        }
      },
      function(error) {
        alert('Share fail with error: ' + error);
      }
    );
  }

  render() {
    const { container, stageOneStyle, button, progressBar, landingPageBody, landingPageBodyText, signInStyle, TextShadowStyle } = styles;
    let { height, width } = Dimensions.get('window');
    console.log(this.state);

    if(this.state.isValidPhoneNumber === false) {
      Toast.show('You have entered an invalid phone number.', Toast.LONG);
    }

    if(this.state.isValidUserDetails) {
      return (
        <View style={container}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <View style={{ height: height / 20}}>
            <Heading>One click away.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../assets/formC.png')}
          />
          <View>
            <View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
              </View>
              <View style={{ height: height / 5, width: width / 1.5}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Icon name="share-android" />
                  {/*<Icon style={{ color: '#333'}} name="share-android" />*/}
                  <Text style={{ fontSize: 20 }}>For a free ride</Text>
                  {/*<Text style={{ fontSize: 20, color: '#ed1768' }}>for a free ride</Text>*/}
                  <TouchableOpacity>
                    <Icon style={{ color: '#1ea1f2'}} name="tweet" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.shareLinkWithShareDialog}>
                    <Icon style={{ color: '#4266b2'}} name="facebook" color='blue'/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
                <TouchableOpacity>
                  <Text style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>No Thanks</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    }

    if(!this.state.isValidPhoneNumber === true) {
      return (
        <View style={container}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <View style={{ height: height / 10}}>
            <Heading>Get MOOVING.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../assets/formA.png')}
          />
          <View>
            <View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
                <Subtitle>Enter your phone number:</Subtitle>
              </View>
              <View style={{ height: height / 5, width: width / 1.5}}>
                <View style={stageOneStyle}>
                  <PhoneInput
                    ref={ref => {
                      this.phone = ref;
                    }}
                    autoFocus
                  />
                  {/*{this.renderInfo()}*/}
                </View>
              </View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
                <ButtonComponent onPress={this.updateInfo} backgroundColor='#f68d65' text='NEXT' />
              </View>
            </View>
          </View>
        </View>
      )
    }

    if(this.state.isValidPhoneNumber) {
      return (
        <View style={container}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <View style={{ height: height / 10}}>
            <Heading>Some more details.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../assets/formB.png')}
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
              onSubmit={() => this.onSubmit()}
            />
          </View>
        </View>
      )
    }

    return (
      {/*<SignUpFormA onChange={this.PhoneNumberPickerChanged}/>*/}
    );
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
  stageOneStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff',
    padding: 20,
  },
  info: {
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginTop: 20
  },
  button: {
    marginTop: 20,
    padding: 10
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
    textDecorationLine: 'underline',
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
});

export { SignUpPage };