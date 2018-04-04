// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, Dimensions } from 'react-native';

// third-parties libraries
import RNPaystack from 'react-native-paystack';
import { Title,TextInput, Heading, Subtitle, Caption } from '@shoutem/ui';
import { FormInput, FormLabel } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';


// common
import {ButtonTextComponent, StatusBarComponent} from "../../common/index";
import Toast from "react-native-simple-toast";

class WithdrawPage extends React.Component {
  state= {
    userToken: '',
    requestSlot: 'LOAD',

    accNumber: '',
    bankNumber: '',
    amount: ''
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
    AsyncStorage.getItem("user").then((value) => {
      this.setState({ user: JSON.parse(value) });
    }).done();
  };


  /**
   * verifyAmount
   *
   * verifies amount input
   * @return {void}
   */
  verifyBankNumber = () => {
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if(this.state.bankNumber < 1) {
      Toast.showWithGravity(`Invalid bank number`,Toast.LONG,Toast.TOP,);
    } else if(this.state.bankNumber.length >= 3) {
      if (!this.state.bankNumber.match(/[a-z]/i) && /^[a-zA-Z0-9- ]*$/.test(this.state.bankNumber) === true && this.state.bankNumber.length >= 3) {
        return true
      }
      else {
        Toast.showWithGravity(`Bank number should contain only numbers`,Toast.LONG,Toast.TOP,);
      }
    }
    else {
      Toast.showWithGravity(`Bank number should be 3 digits or more`,Toast.LONG, Toast.TOP,);
    }
  };

  /**
   * verifyAmount
   *
   * verifies amount input
   * @return {void}
   */
  verifyAccNumber = () => {
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if(this.state.accNumber < 1) {
      Toast.showWithGravity(`Invalid account number`,Toast.LONG,Toast.TOP,);
    } else if(this.state.accNumber.length === 10) {
      if (!this.state.accNumber.match(/[a-z]/i) && /^[a-zA-Z0-9- ]*$/.test(this.state.accNumber) === true && this.state.accNumber.length >= 3) {
        return true
      }
      else {
        Toast.showWithGravity(`Bank account number should contain only numbers`,Toast.LONG,Toast.TOP,);
      }
    }
    else {
      Toast.showWithGravity(`Bank account number should be 10 digits or more`,Toast.LONG, Toast.TOP,);
    }
  };

  /**
   * verifyAmount
   *
   * verifies amount input
   * @return {void}
   */
  verifyAmount = () => {
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if(this.state.amount < 1) {
      Toast.showWithGravity(`Invalid amount`,Toast.LONG,Toast.TOP,);
    } else if(this.state.amount.length >= 3) {
      if (!this.state.amount.match(/[a-z]/i) && /^[a-zA-Z0-9- ]*$/.test(this.state.amount) === true && this.state.amount.length >= 3) {
        return true
      }
      else {
        Toast.showWithGravity(`Amount should contain only numbers`,Toast.LONG,Toast.TOP,);
      }
    }
    else {
      Toast.showWithGravity(`Amount should be 3 digits or more`,Toast.LONG, Toast.TOP,);
    }
  };


  /**
   * withdraw
   *
   * Transfers user's money from wallet to bank account
   * @return {void}
   */
  withdraw = () => {
    if(this.verifyBankNumber()) {
     if(this.verifyAccNumber()) {
       if(this.verifyAmount()) {
         Toast.showWithGravity(`Call server`,Toast.LONG, Toast.TOP,);
       }
     }
    }
  };

  render() {
    let { height, width } = Dimensions.get('window');
    let slots = [ { value: 'LOAD', }, { value: 'TRANSFER', }, { value: 'WITHDRAW', } ];

    return (
      <View style={styles.container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        <View style={{ flexDirection: 'column'}}>
          <View style={{ flexDirection: 'row', width: '70%', marginBottom: 10 }}>
            <View style={{ paddingTop: width / 28 }}>
              <Title>Enter Bank Number: </Title>
            </View>
            <View style={{ width: '70%'}}>
              <TextInput
                placeholder={'0000000'}
                // onChangeText={...}
                autoFocus
                keyboardType='numeric'
                onChangeText={amount => this.setState({ bankNumber: amount.replace(" ", "") })}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '70%', marginBottom: 10 }}>
            <View style={{ paddingTop: width / 28 }}>
              <Title>Enter Acc Number: </Title>
            </View>
            <View style={{ width: '70%'}}>
              <TextInput
                placeholder={'0000000'}
                // onChangeText={...}
                autoFocus
                keyboardType='numeric'
                onChangeText={amount => this.setState({ accNumber: amount.replace(" ", "") })}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '70%', marginBottom: 10 }}>
            <View style={{ paddingTop: width / 28 }}>
              <Title>Enter Amount: </Title>
            </View>
            <View style={{ width: '70%'}}>
              <TextInput
                placeholder={'0000000'}
                // onChangeText={...}
                autoFocus
                keyboardType='numeric'
                onChangeText={amount => this.setState({ amount: amount.replace(" ", "") })}
              />
            </View>
          </View>
          <View style={{ marginTop: 40 }}>
            <ButtonTextComponent
              onPress={this.withdraw}
              buttonText='TRANSFER'
              iconName='send'
              iconType='material'
              backgroundColor='#333'
            />
          </View>
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
});

export { WithdrawPage };
