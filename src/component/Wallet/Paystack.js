// react library
import React, { Component } from 'react';

// react-native library
import {AsyncStorage, Dimensions, StyleSheet} from 'react-native';

// third-party library
import { Container, Toast, Root, Text, Content, Card, CardItem, Body, Button } from 'native-base';
import { LiteCreditCardInput } from "react-native-credit-card-input";

// common
import { StatusBarComponent } from "../../common";
import RNPaystack from "react-native-paystack";
import * as axios from "axios/index";

class Paystack extends Component {

  state={
    amount: '',
    requestType: '',
    originalAmount: '',

    userToken: '',
    user: {
      wallet_amount: 0
    },

    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    amount: '',

    loading: false,

    showToast: false,

    errorMessage: 'Invalid input',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    AsyncStorage.getItem("user").then((value) => {
      this.setState({ user: JSON.parse(value) });
    }).done();

    this.setState({
      amount: this.props.navigation.state.params.amount,
      requestType: this.props.navigation.state.params.requestType,
      originalAmount: this.props.navigation.state.params.originalAmount,
      userToken: this.props.navigation.state.params.userToken
    });
  };

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
      this.setState({
        loading: true
      }, () => {
        this.chargeCard()
      });
    } else {
      Toast.show({ text: `${this.state.errorMessage}`, type: "danger", position: 'top' })
    }
  };

  /**
   * chargeCard
   *
   *
   */
  chargeCard() {
    let amount = this.state.amount * 100;

    RNPaystack.chargeCard({
      cardNumber: this.state.cardNumber,
      expiryMonth: this.state.expiryMonth,
      expiryYear: this.state.expiryYear,
      cvc: this.state.cvc,
      email: this.state.user.email,
      amountInKobo: amount,
    })
      .then(response => {
        console.log(response); // card charged successfully, get reference here
        Toast.show({ text: "Success", buttonText: "Okay", type: "success", position: 'top' });
        this.savePaymentToServer(response);
      })
      .catch(error => {
        console.log(error); // error is a javascript Error object
        console.log(error.message);
        console.log(error.code);
        this.setState({
          loading: false
        });
        Toast.show({ text: `${error.message}`, buttonText: "Okay", type: "danger", position: 'top' });
      })
  }

  /**
   * savePaymentToServer
   *
   * Saves user's payment on our server
   * @param {object} response - return token from paystack
   * @return {void}
   */
  savePaymentToServer = (response) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/transaction',
      {
        "type_of_operation": "load_wallet",
        "cost_of_transaction": JSON.parse(this.state.originalAmount),
        "verification_code": response,
      }
    )
      .then((response) => {
        console.log(response.data.data);
        Toast.show({ text: `${response.data.data.message}`, buttonText: "Okay", type: "success", position: 'top' });
      })
      .catch((error) => {
        console.log(error.response);
        this.setState({ loading: !this.state.loading });
        Toast.show({ text: `${error.response.data.data.message}`, buttonText: "Okay", type: "danger", position: 'top' });
      });

  };

  render() {
    console.log(this.state);
    const { container } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <Root>
        <Container style={container}>
          <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
          <Content>
            <Card style={{
              marginTop: height / 4,
              width: width / 1.1,
              shadowOpacity: 0.75,
              marginLeft: width / 22,
              shadowRadius: 5,
              shadowColor: '#b3b4b4',
              shadowOffset: { height: 0, width: 0 },
            }}>
              <CardItem>
                <Body>
                <Text>
                  Enter card details:
                </Text>
                <LiteCreditCardInput
                  autoFocus
                  onChange={this._onChange}
                  returnKeyType="next"
                />
                </Body>
              </CardItem>
            </Card>
            <Button
              block
              dark
              style={{
                width: width / 2,
                marginLeft: width / 4,
                marginTop: height / 15,
              }}
              onPress={this.onSubmit}
            >
              <Text>LOAD</Text>
            </Button>
          </Content>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export { Paystack }
