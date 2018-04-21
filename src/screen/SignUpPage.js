// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

// third-part library
import { Heading } from '@shoutem/ui';
import Toast from 'react-native-simple-toast';

// component
import { SignUpForm } from "../component";

// common
import { StatusBarComponent } from "../common";

class SignUpPage extends React.Component {
  constructor(){
    super();
  }
  state= {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errorMessage: '',
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
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = () => {
    const { navigate } = this.props.navigation;
    // navigate('NumberFormPage', {
    //   firstName: this.state.firstName,
    //   lastName: this.state.lastName,
    //   email: this.state.email,
    //   password: this.state.password,
    //   imgURL: '',
    //   authentication_type: "email",
    // });
    navigate('SelectSchool', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      imgURL: '',
      authentication_type: "email",
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
      Toast.showWithGravity('First Name field cannot be empty', Toast.LONG, Toast.TOP);
    } else if(format.test(this.state.firstName)){
      Toast.showWithGravity('First Name field cannot special characters', Toast.LONG, Toast.TOP);
    } else if(hasNumber.test(this.state.firstName)) {
      Toast.showWithGravity('First Name field cannot contains numbers', Toast.LONG, Toast.TOP);
    } else if ( this.state.lastName === '') {
      Toast.showWithGravity('Last Name field cannot be empty', Toast.LONG, Toast.TOP);
    } else if(format.test(this.state.lastName)){
      Toast.showWithGravity('Last Name field cannot special characters', Toast.LONG, Toast.TOP);
    } else if(hasNumber.test(this.state.lastName)) {
      Toast.showWithGravity('Last Name field cannot contains numbers', Toast.LONG, Toast.TOP);
    } else if ( this.state.email === '') {
      Toast.showWithGravity('Email field cannot be empty', Toast.LONG, Toast.TOP);
    } else if(this.state.email.match(pattern) === null) {
      Toast.showWithGravity('Email address is badly formatted', Toast.LONG, Toast.TOP);
    } else if ( this.state.password === '' ) {
      Toast.showWithGravity('Password field cannot be empty', Toast.LONG, Toast.TOP);
    } else if(this.state.password.length < 6) {
      Toast.showWithGravity('Password cannot be less than 6 characters', Toast.LONG, Toast.TOP);
    } else if ( this.state.confirmPassword === '' ) {
      Toast.showWithGravity('Confirm Password cannot be empty', Toast.LONG, Toast.TOP);
    } else if ( this.state.confirmPassword !== this.state.password ) {
      Toast.showWithGravity('Password does not match the confirm password field', Toast.LONG, Toast.TOP);
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
      this.appNavigation();
    }
  };

  render() {
    const { container, progressBar, activityIndicator } = styles;
    let { height } = Dimensions.get('window');

    if(this.state.isValidPhoneNumber === false) {
      Toast.showWithGravity('You have entered an invalid phone number.', Toast.LONG, Toast.TOP);
    }

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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={container}>
          <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
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
      </TouchableWithoutFeedback>
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
