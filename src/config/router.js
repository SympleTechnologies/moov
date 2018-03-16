// react library
import React from 'react';

// third-party libraries
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// containers
import { MoovHomepage, WalletHomepage, AskHomepage, ProfileHomepage } from '../container';

export const MooveHome = StackNavigator({
  MoovHomePage: {
    screen: MoovHomepage,
    navigationOptions: {
      header: null,
    }
  },
}, {
  navigationOptions: {
    header: 'screen',
  },
});
//
export const WalletHome = StackNavigator({
  WalletHomePage: {
    screen: WalletHomepage,
    navigationOptions: {
      header: null,
    }
  },
}, {
  navigationOptions: {
    header: 'screen',
  },
});
//
export const AskHome = StackNavigator({
  AskHomepage: {
    screen: AskHomepage,
    navigationOptions: {
      header: null,
    }
  },
  // ChatScreen: {
  //   screen: ChatScreen,
  //   navigationOptions: {
  //     header: null,
  //   }
  // },
}, {
  navigationOptions: {
    header: 'screen',
  },
});
//
export const ProfileHome = StackNavigator({
  ProfileHomepage: {
    screen: ProfileHomepage,
    navigationOptions: {
      header: null,
    }
  },
  // BasicInformation: {
  // 	screen: BasicInformation,
  // 	navigationOptions: {
  // 		header: null,
  // 	}
  // },
  // NotificationsPage: {
  // 	screen: NotificationsPage,
  // 	navigationOptions: {
  // 		header: null,
  // 	}
  // },
  // TransactionsPage: {
  // 	screen: TransactionsPage,
  // 	navigationOptions: {
  // 		header: null,
  // 	}
  // }
}, {
  navigationOptions: {
    // header: '',
  },
});


export const Tabs = TabNavigator({
  Moov: {
    screen: MooveHome,
    navigationOptions: {
      tabBarLabel: 'MOOV',
      color: 'white',
      style: {
        color: '#004a80',
      },
      tabBarIcon: ({ focused }) => (
        focused
          ? <Icon name="ios-car-outline" type="ionicon" color="black" />
          : <Icon name="ios-car-outline" type="ionicon" color="#b3b4b4" />
      ),
    },
  },
  Wallet: {
    screen: WalletHome,
    navigationOptions: {
      tabBarLabel: 'Wallet',
      tabBarIcon: ({ focused }) => (
        focused
          ? <Icon name="credit-card-plus" type="material-community" color="black" />
          : <Icon name="credit-card-plus" type="material-community" color="#b3b4b4" />
      ),
    },
  },
  AskUs: {
    screen: AskHome,
    navigationOptions: {
      tabBarLabel: 'Ask Us',
      tabBarIcon: ({ focused }) => (
        focused
          ? <Icon name="help" type="entypo" color="black" />
          : <Icon name="help" type="entypo" color="#b3b4b4" />
      ),
    },
  },
  Profile: {
    screen: ProfileHome,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ focused }) => (
        focused
          ? <Icon name="user-circle" type="font-awesome" color="black" />
          : <Icon name="user-circle" type="font-awesome" color="#b3b4b4" />
      ),
    },
    style: {
      color: 'green',
    },
  },
}, {
  // tabBarPosition: 'top',
  animationEnabled: true,
  tabBarOptions: {
    style: {
      backgroundColor: 'white',
      padding: 2,
      // tabBarLabelColor: ''
      // marginTop: STATUS_BAR_HEIGHT
    },
    indicatorStyle: {
      borderBottomColor: '#ffffff',
      borderBottomWidth: 3,
    },
    tabStyle: {
      borderRightColor: 'white',
      borderRightWidth: 1,
    },
    activeTintColor: 'black',
    inactiveTintColor: '#b3b4b4'
  },
});