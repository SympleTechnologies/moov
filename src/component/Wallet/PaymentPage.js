// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, Dimensions } from 'react-native';

// third-parties libraries
import RNPaystack from 'react-native-paystack';
import { Title } from '@shoutem/ui';
import { LiteCreditCardInput } from "react-native-credit-card-input";
import Toast from 'react-native-simple-toast';
import { NavigationActions } from 'react-navigation';


// common
import { ButtonTextComponent, StatusBarComponent } from "../../common/index";

class PaymentPage extends React.Component {
  state= {
    userToken: '',
    requestSlot: 'LOAD',

    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    email: 'oforchinedukelechi@gmail.com',
    amount: '',

    errorMessage: '',
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

    this.setState({
      amount: this.props.navigation.state.params.amount,
      requestType: this.props.navigation.state.params.requestType,
    });
  }

  /**
   * goHome
   *
   * returns User to the Wallet selection homepage
   */
  goHome = () => {
    const { navigate } = this.props.navigation;
    navigate('WalletHomePage');
  };


  /**
   * chargeCard
   *
   * p
   */
  chargeCard() {
    let amount = this.state.amount * 100;

    console.log(this.state, 'from state')

    RNPaystack.chargeCard({
      cardNumber: this.state.cardNumber,
      expiryMonth: this.state.expiryMonth,
      expiryYear: this.state.expiryYear,
      cvc: this.state.cvc,
      email: this.state.email,
      amountInKobo: amount,
    })
      .then(response => {
        console.log(response); // card charged successfully, get reference here
        Toast.showWithGravity('Success!', Toast.LONG, Toast.TOP)
        this.goHome();
      })
      .catch(error => {
        console.log(error); // error is a javascript Error object
        console.log(error.message);
        console.log(error.code);
        Toast.showWithGravity(`${error.message}`, Toast.LONG, Toast.TOP)
      })

  }

  /**
   * _onChange
   *
   * Sets states of card parameters and error messages
   * @param {object} form - contains user card details
   * @return {void}
   */
  _onChange = (form) => {
    if(form.status.number === 'valid' && form.status.expiry === 'valid' && form.status.cvc === 'valid') {
      this.setState({
        cardNumber: form.values.number,
        expiryMonth: form.values.expiry.substring(0, 2),
        expiryYear: form.values.expiry.substring(3, 5),
        cvc: form.values.cvc,
      })
    } else {
      this.setState({
        errorMessage:
          `Card Number is ${form.status.number}, Expiry Date is ${form.status.expiry} and CVC is ${form.status.expiry}`
      })
    }
  };

  /**
   * onSubmit
   *
   * Submits the card parameters for to the chargeCard function
   * @return {void}
   */
  onSubmit = () => {
    if ( this.state.cardNumber !== '') {
      this.chargeCard()
    } else {
        Toast.showWithGravity(`${this.state.errorMessage}`, Toast.LONG, Toast.TOP,
      );
    }
  };

  render() {
    // console.log(this.state);
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Wallet'})
      ]
    });


    return (
      <View style={styles.container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <Title>Card payment!</Title>
        <LiteCreditCardInput
          autoFocus
          onChange={this._onChange}
          returnKeyType="next"
        />
        <View style={{ marginTop: 40, zIndex: -1 }}>
          <ButtonTextComponent
            buttonText='LOAD'
            iconName='payment'
            iconType='material'
            backgroundColor='#333'
            onPress={this.onSubmit}
          />
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

export { PaymentPage };
