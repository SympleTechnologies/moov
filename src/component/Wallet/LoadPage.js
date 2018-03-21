// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, Dimensions } from 'react-native';

// third-parties libraries
import RNPaystack from 'react-native-paystack';
import { Title,TextInput, Heading, Subtitle, Caption } from '@shoutem/ui';
import { FormInput, FormLabel } from 'react-native-elements';
import Toast from 'react-native-simple-toast'


// common
import {ButtonTextComponent, StatusBarComponent} from "../../common/index";

class LoadPage extends React.Component {
  state= {
    userToken: '',
    requestSlot: 'LOAD',
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

    // this.chargeCard();
  }

  chargeCard() {

    RNPaystack.chargeCard({
      cardNumber: '507850785078507812',
      expiryMonth: '10',
      expiryYear: '22',
      cvc: '081',
      email: 'oforchinedukelechi@gmail.com',
      amountInKobo: 150000,
    })
      .then(response => {
        console.log(response); // card charged successfully, get reference here
      })
      .catch(error => {
        console.log(error); // error is a javascript Error object
        console.log(error.message);
        console.log(error.code);
      })

  }

  /**
   * verifyAmount
   *
   * Ask user to verify the amount value and sets state of the show modal
   * @return {void}
   */
  verifyAmount = () => {
    if(this.state.amount.length >= 3) {
      if (!this.state.amount.match(/[a-z]/i) && /^[a-zA-Z0-9- ]*$/.test(this.state.amount) === true && this.state.amount.length >= 3) {

      }
      else {
        Toast.showWithGravity(`Amount should contain only numbers`,Toast.LONG,Toast.TOP,);
      }
    }
    else {
      Toast.showWithGravity(`Amount should be 3 digits or more`,Toast.LONG, Toast.TOP,);
    }
  };

  render() {
    console.log(this.state);
    let { height, width } = Dimensions.get('window');
    let slots = [ { value: 'LOAD', }, { value: 'TRANSFER', }, { value: 'WITHDRAW', } ];

    return (
      <View style={styles.container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <View style={{ flexDirection: 'column'}}>
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
              />
              {/*<FormInput*/}
                {/*style={{ flexDirection: 'row', width: 1 }}*/}
                {/*keyboardType='numeric'*/}
                {/*placeholder={''}*/}
                {/*// onChangeText={...}*/}
                {/*onChangeText={amount => this.setState({ amount: amount.replace(" ", "") })}*/}
                {/*value={this.state.amount}*/}
              {/*/>*/}
            </View>
          </View>
           <View style={{ marginTop: 40 }}>
              <ButtonTextComponent
                buttonText='LOAD'
                iconName='payment'
                iconType='material'
                backgroundColor='#333'
                onPress={this.verifyAmount}
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

export { LoadPage };
