// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity, ActivityIndicator, Platform,
  AsyncStorage, ImageBackground, Image
} from 'react-native';

// third-party libraries
import { Container, Content } from 'native-base';

import {StatusBarComponent} from "../common";

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
    imgURL: '',
    loading: false,
    userAuthID: '',

    user: '',
    userToken: '',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method
   * @return {void}
   */
  componentDidMount() {
    const { navigate } = this.props.navigation;
    this.spring();
    // AsyncStorage.getItem("user").then((value) => {
    //   if(value !== null) {
    //     navigate('MoovPages');
    //   }
    // }).done();
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
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = () => {
    console.log('Was clicked')
    const { navigate } = this.props.navigation;
    navigate('SignInPage');
  };

  render() {
    console.log(this.state, 'Entire state');
    const resizeMode = 'center';
    const {
      container,
    } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <Container>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        <ImageBackground
          style={{
            height: height,
            width: width,
            flex: 1
          }}
          source={require('../../assets/moovBG.jpg')}
        >
          <Content contentContainerStyle={{ alignItems: 'center'}}>
            <TouchableOpacity onPress={this.appNavigation}>
            <Animated.Image
              style={{
                alignItems: 'center',
                height: height / 5.5,
                width: width / 3,
                marginTop: height / 10,
                transform: [{scale: this.springValue}],
                borderRadius: 25
              }}
              source={require('../../assets/appLogo.png')}
            />
            </TouchableOpacity>
          </Content>
          <Content/>
          <TouchableOpacity onPress={this.appNavigation}>
          <Image
            styleName="medium"
            style={{
              marginLeft: Platform.OS === 'ios' ? width / 4 : width / 3.3,
              height: Platform.OS === 'ios' ? 90 :  height / 7.3,
              width:  Platform.OS === 'ios' ? 270 : width / 1.5,
            }}
            source={require('../../assets/moov-car-side.png')}
          />
          </TouchableOpacity>
        </ImageBackground>
      </Container>
    );


    // return (
    //   <View style={container}>
    //     <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
    //     <View style={{ alignItems: 'center'}}>
    //       <TouchableOpacity onPress={this.appNavigation}>
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
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    height: Dimensions.get('window').height
  },
});

export { LandingPage };