// react libraries
import React from 'react';

// third-libraries
import { StackNavigator } from 'react-navigation';

// screens
import { LandingPage, SignUpPage, SignInPage, MoovPages } from './src/screen';

// container
import { MoovHomepage } from "./src/container/MoovHomepage";

// component
import { NumberFormPage } from './src/component';

export default MainStack = StackNavigator({
  LandingPage: {
  	screen: LandingPage,
  	navigationOptions: {
  		header: null,
  	}
  },
  SignUpPage: {
  	screen: SignUpPage,
  	navigationOptions: {
  		header: null,
  	}
  },
  SignInPage: {
    screen: SignInPage,
    navigationOptions: {
      header: null,
    }
  },
  NumberFormPage: {
    screen: NumberFormPage,
    navigationOptions: {
      header: null,
    }
  },
  // MoovHomepage: {
  //   screen: MoovHomepage,
  //   navigationOptions: {
  //     header: null,
  //   }
  // },
  MoovPages: {
    screen: MoovPages,
    navigationOptions: {
      header: null,
    }
  },
}, {
  navigationOptions: {
    header: 'screen',
  }
});
