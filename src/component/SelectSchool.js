// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

// third-party libraries
import { Heading, DropDownMenu } from '@shoutem/ui';
import Toast from 'react-native-simple-toast';
import * as axios from "axios/index";

// common
import { StatusBarComponent } from "../common";

class SelectSchool extends React.Component {

  state= {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    school: '',
    imgURL: '',
    socialEmail:'',
    userAuthID: '',
    authentication_type: '',

    loading: false,

    schools: [
      { name: 'SELECT YOUR SCHOOL', value: '0' },
    ],

    selectedSchool: ''
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.setState({
      firstName: this.props.navigation.state.params.firstName,
      lastName: this.props.navigation.state.params.lastName,
      email: this.props.navigation.state.params.email,
      password: this.props.navigation.state.params.password,
      imgURL: this.props.navigation.state.params.imgURL,
      socialEmail: this.props.navigation.state.params.socialEmail,
      userAuthID: this.props.navigation.state.params.userAuthID,
      authentication_type: this.props.navigation.state.params.authentication_type,
    });

    this.getAllSchool();
  };

  /**
   * confirmSchool
   *
   * Confirms user school
   * @return {*}
   */
  confirmSchool = () => {
    return this.state.selectedSchool !== ''
      ? this.appNavigator()
      : Toast.showWithGravity(`Select your school`, Toast.LONG, Toast.TOP);
  };

  /**
   * getAllSchool
   *
   * fetches all school
   */
  getAllSchool = () => {
    this.setState({ loading: !this.state.loading });

    axios.get(`https://moov-backend-staging.herokuapp.com/api/v1/all_schools`)
      .then((response) => {
        console.log(response.data.data.schools);
        this.setState({
          schools: this.state.schools.concat(response.data.data.schools),
          loading: !this.state.loading
        });
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`Unable to fetch available schools`, Toast.LONG, Toast.TOP);
        console.log(error.response.data);
        console.log(error.response);
      });
  };

  /**
   * appNavigator
   *
   * navigates user to second registration screen
   */
  appNavigator = () => {
    const { navigate } = this.props.navigation;
    navigate('NumberFormPage', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      imgURL: this.state.imgURL,
      socialEmail: this.state.socialEmail,
      userAuthID: this.state.userAuthID,
      authentication_type: this.state.authentication_type,
      selectedSchool: this.state.selectedSchool.name
    });
  };

  render() {
    console.log(this.state);
    const {
      container,
      progressBar,
      landingPageBodyText,
      signInStyle,
      TextShadowStyle,
      activityIndicator
    } = styles;

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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            <View>
              <View style={{ height: height / 10, width: width / 1.5}}>
                <View>
                  <DropDownMenu
                    options={this.state.schools}
                    selectedOption={this.state.selectedSchool ? this.state.selectedSchool : this.state.schools[0]}
                    onOptionSelected={(filter) => this.setState({ selectedSchool: filter })}
                    titleProperty="name"
                    valueProperty="value"
                    visibleOptions={10}
                    horizontal
                  />
                </View>
              </View>
              <TouchableOpacity style={{ alignItems: 'center'}} onPress={this.confirmSchool}>
                <Text style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height
  },
  progressBar: {
    width: Dimensions.get('window').width / 1,
    height: Dimensions.get('window').height / 10
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

export { SelectSchool };