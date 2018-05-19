// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, StyleSheet, Dimensions } from 'react-native';

// third-party library
import { Container, Header, Toast, Root, Text, Content, Item, Input, Icon, Button } from 'native-base';

class LoadWallet extends Component {

  state={
    userToken: '',
    user: {
      wallet_amount: 0
    },

    loading: false,

    showToast: false,

    amount: '',

    error: false
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
  };

  /**
   * submitAmount
   *
   * submit Amount
   */
  submitAmount = () => {
    if(this.state.amount < 1) {
      Toast.show({ text: "Invalid Amount", buttonText: "Okay", type: "danger", position: 'top' });
    } else if(this.state.amount.length >= 3) {
      if (!this.state.amount.match(/[a-z]/i) && /^[a-zA-Z0-9- ]*$/.test(this.state.amount) === true && this.state.amount.length >= 3) {
        this.setState({ error: false });
        Toast.show({ text: "Good to go ", buttonText: "Okay", type: "success", position: 'top' });
      }
      else {
        Toast.show({ text: "Amount should contain only numbers", buttonText: "Okay", type: "danger", position: 'top' });
      }
    }
    else {
      Toast.show({ text: "Amount should be 3 digits or more", buttonText: "Okay", type: "danger", position: 'top' });
    }
  };

  /**
   * verifyAmount
   *
   * verifies the amount
   */
  verifyAmount = () => {
    if(this.state.amount.length >= 3) {
      if (!this.state.amount.match(/[a-z]/i) && /^[a-zA-Z0-9- ]*$/.test(this.state.amount) === true && this.state.amount.length >= 3) {
        this.setState({ error: false })
      }
      if (this.state.amount.match(/[a-z]/i) && /^[a-zA-Z0-9- ]*$/.test(this.state.amount) === true && this.state.amount.length >= 3) {
        this.setState({ error: true });
        Toast.show({ text: "Amount should contain only numbers", buttonText: "Okay", type: "danger", position: 'top' });
      }
    }
  };

  /**
   * clearAmount
   *
   * clears the amount state
   */
  clearAmount = () => {
    this.setState({ amount: '', error: false })
  };

  render() {
    console.log(this.state);
    const { container } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <Root>
        <Container style={container}>
          <Content
            contentContainerStyle={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <Item
              error={this.state.error}
              success={!this.state.error && this.state.amount.length >= 3}
              rounded
              style={{
                marginTop: height / 8,
                width: width / 1.2
              }}>
              <Input
                keyboardType='numeric'
                style={{ textAlign: 'center' }}
                placeholder="Enter the amount"
                value={this.state.amount}
                onChangeText={amount => this.setState({ amount: amount.replace(" ", "")}, () => this.verifyAmount())}
              />
              {
                this.state.error
                ? <Icon
                    name={'close-circle'}
                    onPress={() => this.clearAmount()}
                  />
                : <Text/>
              }

              {
                this.state.error === false && this.state.amount.length >= 3
                  ? <Icon
                    name={'checkmark-circle'}
                    onPress={() => this.submitAmount()}
                    // onPress={() => this.submitAmount()}
                    // onPress={this.state.error ? this.setState({ amount: '' }) : this.submitAmount}
                  />
                  : <Text/>
              }
            </Item>
            <Content
              contentContainerStyle={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
            <Button
              block
              dark
              style={{
                marginTop: height / 10,
                width: width / 2
              }}
              onPress={() => this.submitAmount()}
            >
              <Text>Next</Text>
            </Button>
            </Content>
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
  },
});

export { LoadWallet }
