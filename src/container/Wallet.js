// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, StyleSheet, Dimensions } from 'react-native';

// third-party library
import {
  Container,
  Button,
  Icon,
  Segment,
  Content,
  Text,
  Toast,
  Item,
  Input,
	Drawer
} from 'native-base';

// common
import {SegmentHeader, StatusBarComponent} from "../common";
import * as axios from "axios/index";
import { HeaderComponent, SideBar} from "../component/Header";

class Wallet extends Component {

  state={
    userToken: '',
    user: {
      wallet_amount: 0
    },

    loading: false,

    showToast: false,

    currentTab: 'Load',

    amount: '',
    requestType: 'LOAD',
    originalAmount: '',

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
      this.setState({ userToken: value }, () => this.fetchUserDetails());
    }).done();
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
        // console.log(response.data.data);
        this.setState({
          user: response.data.data.user,
        });
      })
      .catch((error) => {
        // console.log(error.response);
        Toast.show({ text: "Unable to retrieve user", buttonText: "Okay", type: "danger" })
      });
  };

  /**
   * setCurrentTab
   *
   * sets the state of the current tab as user clicks
   * @param {string} currentTab - clicked tab
   * @return {void}
   */
  setCurrentTab = (currentTab) => {
    if(currentTab === 'Load') {
      this.setState({ currentTab: 'Load' });
    }

    if(currentTab === 'Transfer') {
      this.setState({ currentTab: 'Transfer' });
    }

    if(currentTab === 'Withdraw') {
      this.setState({ currentTab: 'Withdraw' });
    }
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
        this.setOriginalAmount()
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
   * setOriginalAmount
   *
   * Sets original amount for the Sever to use
   * @return {void}
   */
  setOriginalAmount = () => {
    this.setState({
      originalAmount: this.state.amount,
    }, () => this.addPayStackFee())
  };

  /**
   * addPayStackFee
   */
  addPayStackFee = () => {

    let reg = 0.015 * this.state.amount;

    let newAmount = parseInt(reg) + parseInt(this.state.amount);
    let extraCharge = parseInt(this.state.amount) + 100 + parseInt(reg);

    if(this.state.amount < 2500) {
      this.setState({
        amount: newAmount,
      }, () => {
        this.appNavigation()
      });
    } else if (this.state.amount >= 2500) {
      this.setState({
        amount: extraCharge
      }, () => {
        this.appNavigation()
      });
    }
  };

  /**
   * appNavigation
   *
   * navigates user to payment page
   * @return {void}
   */
  appNavigation = () => {
    const { navigate } = this.props.navigation;

    navigate('Paystack', {
      amount: this.state.amount,
      requestType: this.state.requestType,
      originalAmount: this.state.originalAmount,
      userToken: this.state.userToken
    });
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
	
	/**
	 * closeDrawer
	 *
	 * closes the side bar
	 */
	closeDrawer = () => {
		this.drawer._root.close()
	};
	
	/**
	 * openDrawer
	 *
	 * opens side bar
	 */
	openDrawer = () => {
		this.drawer._root.open()
	};
	
	/**
	 * navigateToProfilePage
	 *
	 * navigates to profile page
	 * @return {void}
	 */
	navigateToTabPage = (page) => {
		const { navigate } = this.props.navigation;
		navigate(page);
	};
	
  render() {
    console.log(this.state);
    const { container } = styles;
    let { height, width } = Dimensions.get('window');

    return (
	    <Drawer
		    ref={(ref) => { this.drawer = ref; }}
		    content={<SideBar tab={'Wallet'} navigateToTabPage={this.navigateToTabPage}  />}
		    onClose={() => this.closeDrawer()} >
        <Container style={container}>
	        <HeaderComponent onPress={() => this.openDrawer()} />
          <Segment
            style={{
              backgroundColor: '#fff',
              marginTop: 20
            }}
          >
            <Button
              style={{
                borderWidth: 1,
                borderColor: '#b3b4b4',
                backgroundColor: this.state.currentTab === 'Load' ? '#b3b4b4' : '#fff'
              }}
              onPress={() => this.setCurrentTab('Load')}
              active={this.state.currentTab === 'Load'}
              first>
              <Text style={{ color: this.state.currentTab === 'Load' ? '#fff' : '#333' }}>Load</Text>
            </Button>
            <Button
              style={{
                borderWidth: 1,
                borderColor: '#b3b4b4',
                backgroundColor: this.state.currentTab === 'Transfer' ? '#b3b4b4' : '#fff'
              }}
              active={this.state.currentTab === 'Transfer'}
              onPress={() =>this.setCurrentTab('Transfer')}
            >
              <Text style={{ color: this.state.currentTab === 'Transfer' ? '#fff' : '#333' }}>Transfer</Text>
            </Button>
            <Button
              style={{
                borderWidth: 1,
                borderColor: '#b3b4b4',
                backgroundColor: this.state.currentTab === 'Withdraw' ? '#b3b4b4' : '#fff'
              }}
              active={this.state.currentTab === 'Withdraw'}
              onPress={() =>this.setCurrentTab('Withdraw')}
              last>
              <Text style={{ color: this.state.currentTab === 'Withdraw' ? '#fff' : '#333' }}>Withdraw</Text>
            </Button>
          </Segment>
          <Content
            style={{
              backgroundColor: '#fff'
            }}
            padder>
            {
              // this.returnComponent()
              this.state.currentTab === 'Load'
                ? <Content
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
                      value={this.state.amount.toString()}
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
                      <Text>NEXT</Text>
                    </Button>
                  </Content>
                </Content>
                : <Text/>
            }
          </Content>
        </Container>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export { Wallet }
