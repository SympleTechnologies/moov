// react libraries
import React from 'react';

// react-native libraries
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, Linking } from 'react-native';

// third-part library
import PhoneInput from "react-native-phone-input";
import { Heading, Subtitle, Button, Icon, Title } from '@shoutem/ui';
import Toast from 'react-native-simple-toast';

// common
import {StatusBarComponent, ButtonComponent, Input, ButtonIconComponent} from "../common";
import {SignUpForm} from "../component";

class SignUpPage extends React.Component {
  state= {
    stage: '1',
    isValidPhoneNumber: '',
    type: "",
    phoneNumber: "",
    isValidUserDetails: true,

    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errorMessage: ''
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
      // this.saveUserToServer();
      this.setState({ isValidUserDetails: true })
    }
  };

  render() {
    const { container, container1, stageOneStyle, button, progressBar } = styles;
    let { height, width } = Dimensions.get('window');
    console.log(this.state);

    if(this.state.isValidPhoneNumber === false) {
      Toast.show('You have entered an invalid phone number.', Toast.LONG);
    }

    if(this.state.isValidUserDetails) {
      return (
        <View style={container1}>
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
                  <Icon style={{ color: '#333'}} name="share-android" />
                  <Text style={{ fontSize: 20, color: '#f47e68' }}>FOR A FREE RIDE!</Text>
                  <TouchableOpacity>
                    <Icon style={{ color: '#1ea1f2'}} name="tweet" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon style={{ color: '#4266b2'}} name="facebook" color='blue'/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
                <ButtonComponent backgroundColor='#f68d65' text='NO THANKS' />
              </View>
            </View>
          </View>
        </View>
      )
    }

    if(!this.state.isValidPhoneNumber === true) {
      return (
        <View style={container1}>
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
        <View style={container1}>
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
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  container1: {
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
  }
});

export { SignUpPage };