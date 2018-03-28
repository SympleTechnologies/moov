// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';

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
    this.spring();
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
   * Navigates user to sign-up page
   * @return {void}
   */
  appNavigation = () => {
    const { navigate } = this.props.navigation;
    navigate('SignInPage');
  };

  render() {
    const { container } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View style={container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <View style={{ alignItems: 'center'}}>
          <TouchableOpacity onPress={this.appNavigation}>
            <Animated.Image
              style={{
                alignItems: 'center',
                height: height / 3.5,
                width: width / 2,
                transform: [{scale: this.springValue}],
                borderRadius: 25
              }}
              source={require('../../assets/appLogo.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
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