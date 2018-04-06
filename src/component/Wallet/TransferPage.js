// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, Dimensions, ActivityIndicator } from 'react-native';

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

    loading: '',
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
   * goHome
   *
   * returns User to the Wallet selection homepage
   */
  goHome = () => {
    console.log('called');
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
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    if(this.verifyDetails()) {
      this.setState({ loading: !this.state.loading });
      axios.post('https://moov-backend-staging.herokuapp.com/api/v1/transaction',
        {
          "type_of_operation": "transfer",
          "cost_of_transaction": JSON.parse(this.state.amount),
          "receiver_email": this.state.email
        }
      )
        .then((response) => {
          console.log(response.data.data);
          this.fetchUserDetails();
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

    // ACTIVITY INDICATOR
    if (this.state.loading) {
      return (
        <View style={{flex: 1, backgroundColor: 'white' }}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <ActivityIndicator
            color = '#004a80'
            size = "large"
            style={styles.activityIndicator}
          />
        </View>
      );
    }

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
                autoCapitalize='none'
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { TransferPage };
