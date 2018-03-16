// react libraries
import React from 'react';

// react-native libraries
import {StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ActivityIndicator, ImageBackground} from 'react-native';

// third-party libraries
import { Heading, Subtitle, Icon } from '@shoutem/ui';
import PhoneInput from "react-native-phone-input";
import * as axios from 'axios';
import Toast from 'react-native-simple-toast';

// common
import { ButtonComponent, StatusBarComponent} from "../common";

class NumberFormPage extends React.Component {
  state= {
    isValidPhoneNumber: '',
    type: '',
    phoneNumber: '',

    firstName: '',
    lastName: '',
    email: '',
    imgURL: '',

    loading: false,

    userCreated: false,
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    // this.setState({
    //   firstName: this.props.navigation.state.params.firstName,
    //   lastName: this.props.navigation.state.params.lastName,
    //   email: this.props.navigation.state.params.email,
    //   imgURL: this.props.navigation.state.params.imgURL,
    // })
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
    }, () => {
      this.createUser()
    });
  };

  /**
   * createUser
   *
   * Creates user in the databse
   * @return {void}
   */
  createUser = () => {
    console.log(this.state, 'before create')

    return this.state.isValidPhoneNumber
      ? this.saveUserToServer()
      : Toast.show('The number supplied did not seem to be a phone number', Toast.LONG);
  };

  /**
   * saveUserToServer
   *
   * Saves user using axios
   * @return {void}
   */
  saveUserToServer = () => {
    this.setState({ loading: !this.state.loading });
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/signup', {
      "user_type": "student",
      "firstname":  this.state.firstName ,
      "lastname": this.state.lastName,
      "email": this.state.email,
      "image_url": this.state.imgURL,
      "mobile_number": this.state.phoneNumber
  })
      .then((response) => {
        this.setState({ loading: !this.state.loading, userCreated: !this.state.userCreated });
        console.log(response);
        Toast.show(`${response.data.data.message}`, Toast.LONG);
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        console.log(error.response.data);
        console.log(error.response.data.data.message);
        Toast.show(`${error.response.data.data.message}`, Toast.LONG);
        console.log(error.message);
      });
  };

  render() {
    console.log(this.state);
    const {
      container,
      progressBar,
      stageTwoStyle,
      landingPageBodyText,
      signInStyle,
      TextShadowStyle,
      activityIndicator
    } = styles;

    let { height, width } = Dimensions.get('window');

    // ACTIVITY INDICATOR
    if (this.state.loading) {
      return (
        <View style={{flex: 1}}>
          <StatusBarComponent />
          <ActivityIndicator
            color = '#f68d65'
            size = "large"
            style={activityIndicator}
          />
        </View>
      );
    }

    if(this.state.userCreated) {
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

    return (
      <View style={container}>
        <ImageBackground
          source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
          style={{width: '100%', height: '100%'}}
        >

        </ImageBackground>
        {/*<StatusBarComponent backgroundColor='white' barStyle="dark-content"/>*/}
        {/*<View style={{ height: height / 10}}>*/}
          {/*<Heading>Get MOOVING.</Heading>*/}
        {/*</View>*/}
        {/*<Image*/}
          {/*style={progressBar}*/}
          {/*source={require('../../assets/formB.png')}*/}
        {/*/>*/}
        {/*<View>*/}
          {/*<View>*/}
            {/*<View style={{ height: height / 15, alignItems: 'center'}}>*/}
              {/*<Subtitle>Enter your phone number:</Subtitle>*/}
            {/*</View>*/}
            {/*<View style={{ height: height / 5, width: width / 1.5}}>*/}
              {/*<View style={stageTwoStyle}>*/}
                {/*<PhoneInput*/}
                  {/*ref={ref => {*/}
                    {/*this.phone = ref;*/}
                  {/*}}*/}
                  {/*autoFocus*/}
                {/*/>*/}
                {/*/!*{this.renderInfo()}*!/*/}
              {/*</View>*/}
            {/*</View>*/}
            {/*/!*<View style={{ height: height / 15, alignItems: 'center'}}>*!/*/}
              {/*/!*<ButtonComponent onPress={this.updateInfo} backgroundColor='#f68d65' text='NEXT'/>*!/*/}
            {/*/!*</View>*!/*/}
            {/*<TouchableOpacity style={{ alignItems: 'center'}} onPress={this.updateInfo}>*/}
              {/*<Text style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Next</Text>*/}
            {/*</TouchableOpacity>*/}
          {/*</View>*/}
        {/*</View>*/}
      </View>
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
  stageTwoStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff',
    padding: 20,
  },
  landingPageBody: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20%',
    textAlign: 'center'
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
    // textDecorationLine: 'underline',
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { NumberFormPage };