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
import * as axios from "axios/index";

class TransferPage extends React.Component {
  state= {
    userToken: '',
    requestSlot: 'LOAD',

    email: '',
    amount: '',
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
  }

  /**
   * verifyDetails
   *
   * Verifies user input before transferring
   * @return {void}
   */
  verifyDetails = () => {
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if ( this.state.email === '') {
      Toast.showWithGravity('Email field cannot be empty', Toast.LONG, Toast.TOP);
    } else if(this.state.email.match(pattern) === null) {
      Toast.showWithGravity('Email address is badly formatted', Toast.LONG, Toast.TOP);
    } else if(this.state.amount < 1) {
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
   * goHome
   *
   * returns User to the Wallet selection homepage
   */
  goHome = () => {
    console.log('called')
    const { navigate } = this.props.navigation;
    navigate('WalletHomePage');
  };

  /**
   * transferToEmail
   *
   * transfer funds from user's wallet to third-party
   */
  transferToEmail = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    if(this.verifyDetails()) {
      this.setState({ loading: !this.state.loading });
      axios.post('https://private-1d8110-moovbackendv1.apiary-mock.com/api/v1/transaction', {
        "type_of_operation": 'transfer',
        "cost_of_transaction": this.state.amount,
        "receiver_email": this.state.email
      })
        .then((response) => {
          console.log(response.data.data);
          this.saveUserToLocalStorage(response.data.data.transaction.receiver_amount_after_transaction);
          // this.saveUserToLocalStorage(response.data.data);
          Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
        })
        .catch((error) => {
          console.log(error.response);
          this.setState({ loading: !this.state.loading });
          Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
        });
    }
  };

  render() {
    console.log(this.state);
    let { height, width } = Dimensions.get('window');
    let slots = [ { value: 'LOAD', }, { value: 'TRANSFER', }, { value: 'WITHDRAW', } ];

    return (
      <View style={styles.container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        <View style={{ flexDirection: 'column'}}>
          <View style={{ flexDirection: 'row', width: '70%', marginBottom: 10 }}>
            <View style={{ paddingTop: width / 28 }}>
              <Title>Receiver's Email: </Title>
            </View>
            <View style={{ width: '70%'}}>
              <TextInput
                placeholder={'john@doe.com'}
                // onChangeText={...}
                autoFocus
                keyboardType='email-address'
                onChangeText={email => this.setState({ email })}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '70%', marginBottom: 10 }}>
            <View style={{ paddingTop: width / 28 }}>
              <Title>Enter Amount: </Title>
            </View>
            <View style={{ marginLeft: width / 18, width: '70%'}}>
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
              onPress={this.transferToEmail}
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

export { TransferPage };
