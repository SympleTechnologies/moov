// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, AsyncStorage, ActivityIndicator } from 'react-native';

// third-parties libraries
import RNPaystack from 'react-native-paystack';
import { Title } from '@shoutem/ui';
import { LiteCreditCardInput } from "react-native-credit-card-input";
import Toast from 'react-native-simple-toast';
import { NavigationActions } from 'react-navigation';


// common
import { ButtonTextComponent, StatusBarComponent } from "../../common/index";
import * as axios from "axios/index";

class PaymentPage extends React.Component {
  state= {
    userToken: '',
    requestSlot: 'LOAD',

    cardNumber: '50785078507850784',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    amount: '',

    errorMessage: '',

    requestType: '',
    originalAmount: '',
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

    // this.setState({
    //   amount: this.props.navigation.state.params.amount,
    //   requestType: this.props.navigation.state.params.requestType,
    //   originalAmount: this.props.navigation.state.params.originalAmount,
    // });

    // this.savePaymentToServer()
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
        Toast.showWithGravity('Success!', Toast.LONG, Toast.TOP);
        this.savePaymentToServer();
      })
      .catch(error => {
        console.log(error); // error is a javascript Error object
        console.log(error.message);
        console.log(error.code);
        this.setState({
          loading: false
        });
        Toast.showWithGravity(`${error.message}`, Toast.LONG, Toast.TOP);
      })
  }

  /**
   * savePaymentToServer
   *
   * Saves user's payment on our server
   */
  savePaymentToServer = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/transaction',
      {
        "type_of_operation": "load_wallet",
        "cost_of_transaction": JSON.parse(this.state.originalAmount)
      }
    )
      .then((response) => {
        console.log(response.data.data);
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
        this.fetchUserDetails();
      })
      .catch((error) => {
        console.log(error.response);
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });

  };

  /**
   * fetchUserDetails
   *
   * fetches User transaction from the back end and saves it in local storage
   * @param newBalance
   * @return {void}
   */
  fetchUserDetails = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.get('https://moov-backend-staging.herokuapp.com/api/v1/user')
      .then((response) => {
        console.log(response.data.data);
        this.setState({ loading: !this.state.loading });
        AsyncStorage.setItem('user', JSON.stringify(response.data.data.user)).then(() => this.goHome());
      })
      .catch((error) => {
        console.log(error.response);
        this.setState({ loading: !this.state.loading });
      });
  };

  /**
   * saveUserToLocalStorage
   *
   * saves User transaction to the back end
   * @param newBalance
   * @return {void}
   */
  saveUserToLocalStorage = (newBalance) => {
    let newUser = {
      authentication_type: this.state.user.authentication_type,
      authorization_code_status: this.state.user.authorization_code_status,
      created_at:  this.state.user.created_at,
      email: this.state.user.email,
      firstname: this.state.user.firstname,
      id: this.state.user.id,
      image_url: this.state.user.image_url,
      lastname: this.state.user.lastname,
      mobile_number: this.state.user.mobile_number,
      modified_at: this.state.user.modified_at,
      ratings: this.state.user.ratings,
      set_temporary_password: this.state.user.set_temporary_password,
      user_type: this.state.user.user_type,
      wallet_amount: newBalance
    };

    AsyncStorage.setItem('user', JSON.stringify(newUser)).then(() => this.goHome());

    this.setState({ loading: !this.state.loading });
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
        Toast.showWithGravity(`${this.state.errorMessage}`, Toast.LONG, Toast.TOP,
      );
    }
  };

  render() {
    const { container, activityIndicator } = styles;

    // ACTIVITY INDICATOR
    if (this.state.loading) {
      return (
        <View style={{flex: 1, backgroundColor: 'white' }}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <ActivityIndicator
            color = '#004a80'
            size = "large"
            style={activityIndicator}
          />
        </View>
      );
    }

    return (
      <View style={container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { PaymentPage };
