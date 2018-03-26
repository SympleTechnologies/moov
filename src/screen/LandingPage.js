// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, TouchableOpacity, Dimensions, Animated } from 'react-native';

// common
import {StatusBarComponent} from "../common";

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
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.spring();
  }

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentWillUnmount() {
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
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = () => {
    const { navigate } = this.props.navigation;
    navigate('SignInPage');
  };

  render() {
    console.log(this.state);

    const { container } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View style={container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
          <TouchableOpacity onPress={this.appNavigation}>
            <Animated.Image
              style={{
                alignItems: 'center',
                height: height / 3.5,
                width: width / 2,
                transform: [{scale: this.springValue}],
                borderRadius: 25,
                marginBottom: 10,
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export { LandingPage };