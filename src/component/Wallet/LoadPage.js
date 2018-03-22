// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, Dimensions, TouchableOpacity } from 'react-native';

// third-parties libraries
import { Title,TextInput, Heading, Subtitle, Caption } from '@shoutem/ui';
import { FormInput, FormLabel } from 'react-native-elements';
import Modal from 'react-native-simple-modal';
import Toast from 'react-native-simple-toast'


// common
import {ButtonTextComponent, StatusBarComponent} from "../../common/index";
import {PaymentPage} from "./PaymentPage";

class LoadPage extends React.Component {
  state= {
    userToken: '',
    requestType: 'LOAD',
    amount: '',
    showModal: false
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

  /**
   * convertAmountToKobo
   *
   * Converts the current amount in naira to kobo
   * @return {void}
   */
  convertAmountToKobo = () => {
    this.setState({ showModal: false });
    const { navigate } = this.props.navigation;
    let amount;

    amount = this.state.amount * 100;

    this.setState({  amount: amount }, () => {
      navigate('PaymentPage', {
        amount: this.state.amount,
        requestType: this.state.requestType,
      });
    });
  };

  /**
   * verifyAmount
   *
   * Ask user to verify the amount value and sets state of the show modal
   * @return {void}
   */
  verifyAmount = () => {
    if(this.state.amount.length >= 3) {
      if (!this.state.amount.match(/[a-z]/i) && /^[a-zA-Z0-9- ]*$/.test(this.state.amount) === true && this.state.amount.length >= 3) {
        this.setState({ showModal: true })
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
        <Modal
          offset={this.state.offset}
          open={this.state.showModal}
          modalDidOpen={this.modalDidOpen}
          modalDidClose={() => this.setState({showModal: false})}
          style={{alignItems: 'center'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 20, marginBottom: 10}}>Confirmation Box!</Text>
            <Text style={{ fontWeight: '700' }}>Amount: {this.state.amount}</Text>
            <View style={{ flexDirection: 'row', marginTop: 40}}>
              <TouchableOpacity
                style={{margin: 5, marginRight: width / 4}}
              >
                <ButtonTextComponent
                  onPress={this.convertAmountToKobo}
                  buttonText='YES'
                  iconName='ios-checkmark-circle-outline'
                  iconType='ionicon'
                  backgroundColor='#004a80'
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{margin: 5}}
              >
                <ButtonTextComponent
                  onPress={() => this.setState({showModal: false})}
                  buttonText='NO'
                  iconName='cancel'
                  iconType='material'
                  backgroundColor='#a84441'
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ flexDirection: 'column', zIndex: -1}}>
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
           <View style={{ marginTop: 40, zIndex: -1 }}>
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
