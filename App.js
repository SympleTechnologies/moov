// react libraries
import React from 'react';

// third-libraries
import { StackNavigator } from 'react-navigation';

// screens
import { LandingPage, SignUpPage, SignInPage, MoovPages } from './src/screen';

// third-party libraries
import { Root } from 'native-base';

// component
import { NumberFormPage, SelectSchool } from './src/component';
import { FirstPage } from "./src/component/Registration";

const AppNavigator = StackNavigator({
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
  FirstPage: {
    screen: FirstPage,
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
  SelectSchool: {
    screen: SelectSchool,
    navigationOptions: {
      header: null,
    }
  },
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

export default () =>
  <Root>
    <AppNavigator />
  </Root>;