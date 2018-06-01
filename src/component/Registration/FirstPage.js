// react library
import React, { Component } from 'react';

// react-native library
import {
  AsyncStorage,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Animated, ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';

// third-party library
import { Container, Toast, Root, Content, Text, Item, Icon, Input, Button } from 'native-base';
import { NavigationActions } from 'react-navigation';

// screen
import {LandingPage} from "../../screen";

// common
import { StatusBarComponent } from "../../common";
import { Fonts } from "../../utils/Font";


class FirstPage extends Component {

  state={
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  /**
   * constructor
   */
  constructor () {
    super();
    this.springValue = new Animated.Value(0.3);
  }

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.spring();
  };

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
   * signInPage
   *
   * navigates to sign-ip page
   * @return {void}
   */
  signInPage = () => {
    this.props.navigation.dispatch(new NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'LandingPage'}),
        NavigationActions.navigate({ routeName: 'SignInPage'})
      ]
    }));
  };

  /**
   * submitForm
   *
   * calls validate method before moving to the next form
   */
  submitForm = () => {
    const { navigate } = this.props.navigation;

    if(this.validateFields()) {
      this.successMessage('YAY!')
      navigate('SecondPage', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        imgURL: '',
        authentication_type: "email",
      });
    }
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
      this.errorMessage('First Name field cannot be empty')
    } else if(format.test(this.state.firstName)){
      this.errorMessage('First Name field cannot special characters')
    } else if(hasNumber.test(this.state.firstName)) {
      this.errorMessage('First Name field cannot contains numbers')
    } else if ( this.state.lastName === '') {
      this.errorMessage('Last Name field cannot be empty')
    } else if(format.test(this.state.lastName)){
      this.errorMessage('Last Name field cannot special characters')
    } else if(hasNumber.test(this.state.lastName)) {
      this.errorMessage('Last Name field cannot contains numbers')
    } else if ( this.state.email === '') {
      this.errorMessage('Email field cannot be empty')
    } else if(this.state.email.match(pattern) === null) {
      this.errorMessage('Email address is badly formatted')
    } else if ( this.state.password === '' ) {
      this.errorMessage('Password field cannot be empty')
    } else if(this.state.password.length < 6) {
      this.errorMessage('Password cannot be less than 6 characters')
    } else if ( this.state.confirmPassword === '' ) {
      this.errorMessage('Confirm Password cannot be empty')
    } else if ( this.state.confirmPassword !== this.state.password ) {
      this.errorMessage('Password does not match the confirm password field')
    } else {
      return true
    }
  };

  /**
   * errorMessage
   *
   * displays error message to user using toast
   * @param errorMessage
   * return {void}
   */
  errorMessage = (errorMessage) => {
    Toast.show({ text: `${errorMessage}`, type: "danger", position: 'top' })
  };

  /**
   * successMessage
   *
   * displays success message to user using toast
   * @param successMessage
   * return {void}
   */
  successMessage = (successMessage) => {
    Toast.show({ text: `${successMessage}`, type: "success", position: 'top' })
  };

  render() {
    const { container, getText, moovingText, activityIndicator } = styles;
    let { height, width } = Dimensions.get('window');

    return (
	    <ImageBackground
		    style={{
			    height: '100%',
			    width: '100%',
		    }}
		    source={require('../../../assets/moovBG1.png')}
	    >
		    <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
		    <Content contentContainerStyle={{
		      alignItems: 'center',
          marginTop: Platform.OS === 'ios' ? 80 : 35
		    }}>
			    <Content
				    contentContainerStyle={{
					    marginTop: 35,
					    flexDirection: 'row',
					    alignItems: 'center',
					    justifyContent: 'center'
				    }}>
				    <Text style={getText}>Get</Text>
				    <Text style={moovingText}> mooving!</Text>
			    </Content>
			    <Content
				    contentContainerStyle={{
					    flexDirection: 'row',
					    alignItems: 'center',
					    justifyContent: 'center',
					    width: width / 1.2,
				    }}>
				    <Button
					    style={{
						    marginTop: 10,
						    backgroundColor: '#fff',
						    shadowOpacity: 0.75,
						    // shadowRadius: 5,
						    shadowColor: '#b3b4b4',
						    shadowOffset: { height: 0, width: 0 },
						    borderColor: '#b3b4b4',
						    borderWidth: 0.2,
						    marginLeft: 10,
						    marginBottom: 10,
					    }}>
					    <Text style={{ color: '#ffc653', fontWeight: '800', }}>1</Text>
				    </Button>
				    <Content
					    contentContainerStyle={{
						    borderWidth: 0.4,
						    borderColor: '#b3b4b4',
						    marginTop: 10,
						    marginBottom: 10,
					    }}>
				    </Content>
			    </Content>
			    <ScrollView
            // scrollEnabled={false} // the view itself doesn't scroll up/down (only if all fields fit into the screen)
            // keyboardShouldPersistTaps='always' // make keyboard not disappear when tapping outside of input
				    enableAutoAutomaticScroll={true}
				    style={{
					    marginLeft: width / 40,
					    marginTop: 10,
					    width: width / 1.2,
					    borderWidth: 1,
					    borderColor: '#b3b4b4',
					    borderRadius: 10,
					    backgroundColor: 'white'
				    }}>
				    <Item style={{ borderWidth: 1, borderColor: '#b3b4b4', height: 45 }}>
					    <Icon
						    style={{ marginLeft: width / 20, color: '#b3b4b4' }}
						    color={'b3b4b4'}
						    active
						    name='user'
						    type='Entypo'
					    />
					    <Input
						    placeholder='First Name'
						    placeholderTextColor='#b3b4b4'
						    value={this.state.firstName}
						    onChangeText={firstName => this.setState({ firstName })}
						    autoCapitalize='none'
						    style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
					    />
				    </Item>
				    <Item style={{ borderWidth: 1, borderColor: '#b3b4b4' }}>
					    <Icon
						    style={{ marginLeft: width / 20, color: '#b3b4b4' }}
						    color={'b3b4b4'}
						    active
						    name='user'
						    type='Entypo'
					    />
					    <Input
						    placeholder='Last Name'
						    placeholderTextColor='#b3b4b4'
						    value={this.state.lastName}
						    onChangeText={lastName => this.setState({ lastName })}
						    autoCapitalize='none'
						    style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
					    />
				    </Item>
				    <Item style={{ borderWidth: 1, borderColor: '#b3b4b4', height: 45 }}>
					    <Icon
						    style={{ marginLeft: width / 20, color: '#b3b4b4' }}
						    color={'b3b4b4'}
						    active name='ios-mail-outline'
						    type='Ionicons'
					    />
					    <Input
						    placeholder='Email'
						    placeholderTextColor='#b3b4b4'
						    value={this.state.email}
						    onChangeText={email => this.setState({ email })}
						    autoCapitalize='none'
						    style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
					    />
				    </Item>
				    <Item>
					    <Icon
						    active
						    style={{ marginLeft: width / 20, color: '#b3b4b4', height: 45 }}
						    name='user-secret'
						    type="FontAwesome"
						    returnKeyType='next'
					    />
					    <Input
						    placeholder='Password'
						    placeholderTextColor='#b3b4b4'
						    secureTextEntry
						    onChangeText={password => this.setState({ password })}
						    value={this.state.password}
						    autoCapitalize='none'
						    style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
					    />
				    </Item>
				    <Item>
					    <Icon
						    active
						    style={{ marginLeft: width / 20, color: '#b3b4b4', height: 45 }}
						    name='user-secret'
						    type="FontAwesome"
						    returnKeyType='next'
					    />
					    <Input
						    placeholder='Confirm Password'
						    placeholderTextColor='#b3b4b4'
						    secureTextEntry
						    onChangeText={confirmPassword => this.setState({ confirmPassword })}
						    value={this.state.confirmPassword}
						    autoCapitalize='none'
						    style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
					    />
				    </Item>
			    </ScrollView>
			    <Button
				    style={{
					    width: width / 1.5,
					    marginLeft: width / 5.6,
					    marginTop: 20,
					    backgroundColor: '#fff',
					    borderWidth: 1,
					    borderColor: '#d3000d',
				    }}
				    onPress={this.submitForm}
				    block
				    dark>
				    {
					    this.state.loading
						    ?
						    <ActivityIndicator
							    color = '#fff'
							    size = "large"
							    style={activityIndicator}
						    />
						    :
						    <Text style={{ color: '#d3000d', fontWeight: '900', fontFamily: Fonts.GothamRoundedLight }}>
							    Next
						    </Text>
				    }
			    </Button>
			    <Content
				    contentContainerStyle={{
					    marginTop: 20,
					    flexDirection: 'row',
					    alignItems: 'center',
					    justifyContent: 'center'
				    }}>
				    <Text style={{ color: '#9b9b9b', fontSize: 12, fontFamily: Fonts.GothamRounded }}>
					    Do you have an account?
				    </Text>
				    <TouchableOpacity onPress={this.signInPage}>
					    <Text
						    style={{
							    color: '#f00266',
							    fontSize: 12,
							    fontWeight: '900',
							    fontFamily: Fonts.GothamRounded
						    }}> Sign In</Text>
				    </TouchableOpacity>
			    </Content>
		    </Content>
	    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getText: {
    fontSize: 25, color: '#ffc653', fontWeight: '400', fontFamily: Fonts.GothamRounded
  },
  moovingText: {
    fontSize: 25, color: '#d3000d', fontWeight: '400', fontFamily: Fonts.GothamRounded
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { FirstPage }
