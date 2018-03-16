// react libraries
import React from 'react';

// third-libraries
import { StackNavigator } from 'react-navigation';

// screens
import { LandingPage, SignUpPage, SignInPage } from './src/screen';

// component
import { NumberFormPage } from './src/component';

export default MainStack = StackNavigator({
  // LandingPage: {
  // 	screen: LandingPage,
  // 	navigationOptions: {
  // 		header: null,
  // 	}
  // },
  // SignUpPage: {
  // 	screen: SignUpPage,
  // 	navigationOptions: {
  // 		header: null,
  // 	}
  // },
  // SignInPage: {
  //   screen: SignInPage,
  //   navigationOptions: {
  //     header: null,
  //   }
  // },
  NumberFormPage: {
    screen: NumberFormPage,
    navigationOptions: {
      header: null,
    }
  },
}, {
  navigationOptions: {
    header: 'screen',
  }
});
