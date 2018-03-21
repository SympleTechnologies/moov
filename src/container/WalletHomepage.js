// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, Dimensions, TouchableOpacity } from 'react-native';

// third-parties libraries
import RNPaystack from 'react-native-paystack';
import { Title,TextInput, Heading, Subtitle, Caption } from '@shoutem/ui';
import { FormInput, FormLabel } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';


// common
import {ButtonTextComponent, StatusBarComponent} from "../common";

class WalletHomepage extends React.Component {
  state= {
    userToken: '',
    requestType: 'LOAD'
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      this.setState({ userToken: value });
    }).done();
  }

  /**
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = () => {
    console.log(this.state.requestSlot);
    const { navigate } = this.props.navigation;

    if (this.state.requestType === 'LOAD') {
      navigate('LoadPage')
    }

    if (this.state.requestType === 'TRANSFER') {
      navigate('TransferPage')
    }

    if (this.state.requestType === 'WITHDRAW') {
      navigate('WithdrawPage')
    }
  };

  render() {
    console.log(this.state);

    const {
      container,
      TextShadowStyle
    } = styles;
    let { height, width } = Dimensions.get('window');
    let slots = [ { value: 'LOAD', }, { value: 'TRANSFER', }, { value: 'WITHDRAW', } ];

    return (
      <View style={container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <View style={{ flexDirection: 'column'}}>
          <View style={{ flexDirection: 'row', width: '70%'}}>
            <View style={{ paddingTop: width / 12 }}>
              <Title>Transaction: </Title>
            </View>
            <View style={{ width: '80%'}}>
              <View style={{ width: '70%', zIndex: -1, marginLeft: width / 10}}>
                <Dropdown
                  // label='slots'
                  // itemColor='blue'
                  data={slots}
                  value='LOAD'
                  onChangeText={ requestType => this.setState({ requestType }) }
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{ alignItems: 'center'}}
            onPress={() => {this.appNavigation()}}
          >
            <Text
              style={TextShadowStyle} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
            >
              Next
            </Text>
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
    borderWidth: 1,
    borderColor: '#b3b4b4',
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
      color: '#333',
      marginTop: Dimensions.get('window').width / 3,
      backgroundColor: 'white',
    },
});

export { WalletHomepage };
