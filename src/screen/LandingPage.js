// react libraries
import React from 'react';

// react-native libraries
import {
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Image,
  AsyncStorage
} from 'react-native';

// third-party libraries
import { Container, Content } from 'native-base';

// common
import { StatusBarComponent } from "../common";

class LandingPage extends React.Component {
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
   * Navigates user to SignIn page
   * @return {void}
   */
  appNavigation = () => {
    const { navigate } = this.props.navigation;
    navigate('SignInPage');
  };

  render() {
    console.log(this.state, 'Entire state');
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
          source={require('../../assets/moovBG2.png')}
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
  }
}

export { LandingPage };
