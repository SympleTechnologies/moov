// react library
import React, { Component } from 'react';

// react-native library
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';

// third-party library
import { Container, Toast, Content, Text, Icon, Button, Picker } from 'native-base';

// common
import { StatusBarComponent } from "../../common";
import { Fonts } from "../../utils/Font";
import * as axios from "axios/index";

class SecondPage extends Component {

  state={
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    imgURL: '',
    socialEmail: '',
    userAuthID: '',
    authentication_type: '',

    schools: [
      { name: 'BABCOCK UNIVERSITY', value: 'BABCOCK UNIVERSITY' },
      { name: 'COVENANT UNIVERSITY', value: 'COVENANT UNIVERSITY' },
    ],

    selectedSchool: "BABCOCK UNIVERSITY",
  };

  /**
   * onValueChange
   *
   * sets the selected school
   * @param value
   */
  onValueChange(value) {
    this.setState({
      selectedSchool: value
    });
  }

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
   * getAllSchool
   *
   * fetches all school
   */
  getAllSchool = () => {
    this.setState({ loading: !this.state.loading });

    axios.get(`https://moov-backend-staging.herokuapp.com/api/v1/all_schools`)
      .then((response) => {
        this.setState({
          schools: response.data.data.schools,
        });
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
      });
  };

  /**
   * appNavigator
   *
   * navigates user to second registration screen
   */
  appNavigator = () => {
    Toast.show({ text: `Yay!`, type: "success", position: 'top' });
    const { navigate } = this.props.navigation;
    navigate('FinalPage', {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      imgURL: this.state.imgURL,
      socialEmail: this.state.socialEmail,
      userAuthID: this.state.userAuthID,
      authentication_type: this.state.authentication_type,
      selectedSchool: this.state.selectedSchool
    });
  };

  render() {
    const { container, getText, moovingText } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <Container style={container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        <ImageBackground
          style={{
            height: height,
            width: width,
          }}
          source={require('../../../assets/moovBG1.png')}
        >
          <Content contentContainerStyle={{ alignItems: 'center'}}>
            <TouchableOpacity onPress={this.spring}>
              <Animated.Image
                style={{
                  alignItems: 'center',
                  height: height / 10.4,
                  width: width / 5.4,
                  marginTop: Platform.OS === 'ios' ? height / 9 : height / 10,
                  transform: [{scale: this.springValue}],
                  borderRadius: 10
                }}
                source={require('../../../assets/appLogo.png')}
              />
            </TouchableOpacity>
            <Content
              contentContainerStyle={{
                marginTop: height / 25,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text style={getText}>Few</Text>
              <Text style={moovingText}> details!</Text>
            </Content>
            <Content
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: width / 1.3,
              }}>
              <Content
                contentContainerStyle={{
                  borderWidth: 0.9,
                  borderColor: '#ffc653',
                  marginTop: 10,
                  marginBottom: 10,
                  width: width / 2
                }}>
              </Content>
              <Button
                style={{
                  marginTop: 10,
                  backgroundColor: '#fff',
                  shadowOpacity: 0.75,
                  shadowColor: '#b3b4b4',
                  shadowOffset: { height: 0, width: 0 },
                  borderColor: '#b3b4b4',
                  borderWidth: 0.2,
                  marginBottom: 10,
                }}>
                <Text style={{ color: '#ffc653', fontWeight: '800', }}>2</Text>
              </Button>
              <Content
                contentContainerStyle={{
                  borderWidth: 0.4,
                  borderColor: '#b3b4b4',
                  marginTop: 10,
                  marginBottom: 10,
                  width: width / 2
                }}>
              </Content>
            </Content>
            <Content
              contentContainerStyle={{
                height: height / 2.5,
                alignItems: 'center'
              }}>
              <Content
                contentContainerStyle={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Text
                  style={{
                    marginTop: height / 8,
                    color: '#b3b4b4',
                    fontFamily: Fonts.GothamRoundedLight,
                    fontWeight: '100',
                  }}
                >Select Preferred Institution</Text>
                <Content
                  contentContainerStyle={{
                    marginTop: 20,
                    borderWidth: 1,
                    borderColor: '#b3b4b4',
                    width: width / 1.5,
                    height: height / 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon
                    style={{
                      marginLeft: Platform.OS === 'ios' ? 10 : 10,
                      color: '#b3b4b4'
                    }}
                    color={'b3b4b4'}
                    active
                    name='school'
                    type='MaterialIcons'
                  />

                  {
                    this.state.schools.length < 3
                    ?
                      <Picker
                        mode="dropdown"
                        textStyle={{ fontSize: 12, color:'#b3b4b4'}}
                        iosHeader="Available"
                        iosIcon={<Icon name="ios-arrow-down-outline" color="#d3000d" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.selectedSchool}
                        onValueChange={this.onValueChange.bind(this)}
                      >
                        <Picker.Item label="BABCOCK UNIVERSITY" value="BABCOCK UNIVERSITY" />
                        <Picker.Item label="COVENANT UNIVERSITY" value="COVENANT UNIVERSITY" />
                      </Picker>

                      : <Picker
                          mode="dropdown"
                          textStyle={{ fontSize: 12, color:'#b3b4b4'}}
                          iosHeader="Available"
                          iosIcon={<Icon name="ios-arrow-down-outline" />}
                          placeholderIconColor="#d3000d"
                          style={{ width: undefined }}
                          selectedValue={this.state.selectedSchool}
                          onValueChange={this.onValueChange.bind(this)}
                        >
                          {
                            this.state.schools.map((value) => (
                              <Picker.Item key={value} label={value.name} value={value.name} />
                            ))
                          }
                        </Picker>
                  }

                </Content>
              </Content>
            </Content>
            <Button
              style={{
                width: width / 1.5,
                marginLeft: width / 5.6,
                marginTop: 20,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#d3000d',
              }}
              onPress={this.appNavigator}
              block
              dark>
              <Text style={{ color: '#d3000d', fontWeight: '900', fontFamily: Fonts.GothamRoundedLight }}>
                Next
              </Text>
            </Button>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getText: {
    fontSize: 35, color: '#ffc653', fontWeight: '400', fontFamily: Fonts.GothamRounded
  },
  moovingText: {
    fontSize: 35, color: '#d3000d', fontWeight: '400', fontFamily: Fonts.GothamRounded
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { SecondPage }
