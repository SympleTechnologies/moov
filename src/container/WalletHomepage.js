// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';

// third-parties libraries
import RNPaystack from 'react-native-paystack';

class WalletHomepage extends React.Component {
  state= {
    userToken: '',
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

    this.chargeCard();
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

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        <Text>Wallet Pages</Text>
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
    borderColor: '#b3b4b4'
  },
});

export { WalletHomepage };
