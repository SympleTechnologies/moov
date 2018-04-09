// react library
import React from 'react';

// react-native libraries
import {
  Text
} from 'react-native';

// third-party libraries
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import IconBadge from 'react-native-icon-badge';

// containers
import { MoovHomepage, WalletHomepage, AskHomepage, ProfileHomepage } from '../container';

// component
import { LoadPage, TransferPage, WithdrawPage, PaymentPage } from "../component/Wallet";

export const MoovHome = StackNavigator({
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
  LoadPage: {
    screen: LoadPage,
    navigationOptions: {
      header: null,
    }
  },
  TransferPage: {
    screen: TransferPage,
    navigationOptions: {
      header: null,
    }
  },
  WithdrawPage: {
    screen: WithdrawPage,
    navigationOptions: {
      header: null,
    }
  },
  PaymentPage: {
    screen: PaymentPage,
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
    // screen: ProfileHomepage,
    screen: props => <ProfileHomepage screenProps={{ unreadMessagesCount: 45 }} />,
    navigationOptions: {
      header: null,
    },
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
  // navigationOptions: ({ screenProps }) => ({
  //   header: null,
  //   tabBarIcon: ({ focused, tintColor}) =>
  //     <IconBadge
  //       MainElement={<Icon name="user-circle" type="font-awesome" size={22} color={ focused ? tintColor : "#b3b4b4" } />}
  //       BadgeElement={<Text style={{ color: 'white' }}>{screenProps.unreadMessagesCount}</Text>}
  //       Hidden={screenProps.unreadMessagesCount === 0}
  //       // badgeNumber={navigation.state.params.badgeCount}
  //     />
  //
  // }),
  navigationOptions: ({ screenProps }) => ({
    header: null,
    tabBarIcon: ({tintColor, focused}) =>
      <IconBadge
        MainElement={<Icon name="user-circle" type="font-awesome" size={22} color={ focused ? tintColor : "#b3b4b4" } />}
        BadgeElement={<Text style={{ color: 'white' }}>{screenProps.unreadMessagesCount}</Text>}
        Hidden={screenProps.unreadMessagesCount === 0}
      />
  })
});


export const Tabs = TabNavigator({
  Moov: {
    screen: MoovHome,
    navigationOptions: {
      tabBarLabel: 'MOOV',
      color: 'white',
      style: {
        color: '#004a80',
      },
      tabBarIcon: ({ focused, tintColor }) => (
        <Icon name="ios-car-outline" type="ionicon" color={ focused ? tintColor : "#b3b4b4" } />
      ),
    },
  },
  Wallet: {
    screen: WalletHome,
    navigationOptions: {
      tabBarLabel: 'Wallet',
      tabBarIcon: ({ focused, tintColor }) => (
        <Icon name="credit-card-plus" type="material-community" color={ focused ? tintColor : "#b3b4b4" } />
      ),
    },
  },
  AskUs: {
    screen: AskHome,
    navigationOptions: {
      tabBarLabel: 'Ask Us',
      tabBarIcon: ({ focused, tintColor }) => (
        <Icon name="help" type="entypo" color={ focused ? tintColor : "#b3b4b4" } />
      ),
    },
  },
  Profile: {
    screen: ProfileHome,
    style: {
      color: 'green',
    },
  },
}, {
  // tabBarPosition: 'top',
  animationEnabled: true,
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    style: {
      backgroundColor: 'white',
      padding: 2,
      // tabBarLabelColor: ''
      // marginTop: STATUS_BAR_HEIGHT
    },
    indicatorStyle: {
      borderBottomColor: 'black',
      // borderBottomColor: '#ffffff',
      // borderBottomWidth: 1,
      backgroundColor:'black'
    },
    tabStyle: {
      borderRightColor: 'white',
      borderRightWidth: 1,
    },
    activeTintColor: 'black',
    inactiveTintColor: '#b3b4b4',
    animationEnabled: true,
  },
});