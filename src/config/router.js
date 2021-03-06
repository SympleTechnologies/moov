// react library
import React from 'react';

// third-party libraries
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Icon, Root } from 'native-base';


// containers
import { MoovHomepage, WalletHomepage, AskHomepage, ProfileHomepage, MoovPage, Wallet } from '../container';

// component
import { LoadPage, TransferPage, WithdrawPage, PaymentPage, Paystack } from "../component/Wallet";

// common
import { FooterComponent } from "../common";

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
  Wallet: {
    screen: Wallet,
    navigationOptions: {
      header: null,
    }
  },

  Paystack: {
    screen: Paystack,
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
}, {
  navigationOptions: {
    header: 'screen',
  },
});
// //
// export const AskHome = StackNavigator({
//   AskHomepage: {
//     screen: AskHomepage,
//     navigationOptions: {
//       header: null,
//     }
//   },
//   // ChatScreen: {
//   //   screen: ChatScreen,
//   //   navigationOptions: {
//   //     header: null,
//   //   }
//   // },
// }, {
//   navigationOptions: {
//     header: 'screen',
//   },
// });
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
  MoovPage: {
    screen: MoovPage,
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
  AskHomepage: {
    screen: AskHomepage,
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
  // Moov: {
  //   screen: MoovHome,
  //   navigationOptions: {
  //     tabBarLabel: 'MOOV',
  //     color: 'white',
  //     style: {
  //       color: '#004a80',
  //     },
  //     tabBarIcon: ({ focused }) => (
  //       focused
  //         ? <Icon name="ios-car-outline" type="ionicon" color="black" />
  //         : <Icon name="ios-car-outline" type="ionicon" color="#b3b4b4" />
  //     ),
  //   },
  // },
  // // AskUs: {
  // //   screen: AskHome,
  // //   navigationOptions: {
  // //     tabBarLabel: 'Ask Us',
  // //     tabBarIcon: ({ focused }) => (
  // //       focused
  // //         ? <Icon name="help" type="entypo" color="black" />
  // //         : <Icon name="help" type="entypo" color="#b3b4b4" />
  // //     ),
  // //   },
  // // },
  // Profile: {
  //   screen: ProfileHome,
  //   navigationOptions: {
  //     tabBarLabel: 'Profile',
  //     tabBarIcon: ({ focused }) => (
  //       focused
  //         ? <Icon name="user-circle" type="font-awesome" color="black" />
  //         : <Icon name="user-circle" type="font-awesome" color="#b3b4b4" />
  //     ),
  //   },
  //   style: {
  //     color: 'green',
  //   },
  // },
}, {
  tabBarComponent: props => {
    return (
      <FooterComponent
        navigation={props.navigation}
        currentTab={'WALLET'}
      />
    );
  },
  tabBarPosition: 'bottom',
  // animationEnabled: true,
  // tabBarOptions: {
  //   showIcon: true,
  //   style: {
  //     backgroundColor: 'white',
  //     padding: 2,
  //     // tabBarLabelColor: ''
  //     // marginTop: STATUS_BAR_HEIGHT
  //   },
  //   indicatorStyle: {
  //     borderBottomColor: 'black',
  //     // borderBottomColor: '#ffffff',
  //     // borderBottomWidth: 1,
  //     backgroundColor:'black'
  //   },
  //   tabStyle: {
  //     borderRightColor: 'white',
  //     borderRightWidth: 1,
  //   },
  //   activeTintColor: 'black',
  //   inactiveTintColor: '#b3b4b4',
  //   animationEnabled: true,
  // },
});