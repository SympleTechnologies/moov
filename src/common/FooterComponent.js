// react library
import React, { Component } from 'react';

// react-native library
import {Platform, Image, AsyncStorage, StyleSheet} from 'react-native';

// third-party library
import {Container, Content, Footer, FooterTab, Button, Text, Root, Badge, Thumbnail, Toast} from 'native-base';

import { Icon } from 'react-native-elements';


// container
import { MoovPage } from "../container";
import * as axios from "axios/index";
import {SpinnerCommon} from "./SpinnerCommon";
import {StatusBarComponent} from "./StatusBarComponent";

class FooterComponent extends Component {

  state={
    currentTab: 'MOOV',
    notificationCount: 0,
    // notificationType: 'MOOV'
    // notificationType: 'WALLET'
    notificationType: 'DRIVER',
    // notificationType: 'ASK'
    // notificationType: 'MULTIPLE'
    // notificationType: 'ADVERT',

    loading: false,
    user: {
      image_url: '',
      wallet_amount: ''
    },
  };

  // before you set notification state
  // if you are on profile display red new notification
  // if you are on moov check notification type if it is DRIVER display toast esle increase notification count


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
        console.log(response.data.data);
        this.setState({
          user: response.data.data.user,
        });
        this.getNotifications()
      })
      .catch((error) => {
        console.log(error.response);
        Toast.show({ text: "Unable to retrieve user", buttonText: "Okay", type: "danger" })
      });
  };

  /**
   * getNotifications
   *
   * Get all User's notifications
   * @return {void}
   */
  getNotifications = () => {
    this.setState({ activeTab: 'notifications' });

    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.get('https://moov-backend-staging.herokuapp.com/api/v1/notification')
      .then((response) => {
        console.log(response.data.data);
        console.log(Object.keys(response.data.data.notifications).length);
        this.setState({
          notifications: response.data.data,
          notificationCount: Object.keys(response.data.data.notifications).length
        })
      })
      .catch((error) => {
        console.log(error.response);
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
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
    if(currentTab === 'MOOV') {
      this.setState({ currentTab: 'MOOV' });
      this.props.navigation.navigate("MoovPage")
    }

    if(currentTab === 'WALLET') {
      this.setState({ currentTab: 'WALLET' })
    }

    if(currentTab === 'ASK') {
      this.setState({ currentTab: 'ASK' });
      this.props.navigation.navigate("AskHomepage")
    }

    if(currentTab === 'PROFILE') {
      this.setState({ currentTab: 'PROFILE' });
      this.clearNotifications();
    }
  };

  /**
   * setCurrentTab
   *
   * clears notification count
   * @return {void}
   */
  clearNotifications = () => {
    this.setState({
      notificationCount: 0
    })
  };

  render() {
    console.log(this.state, 'current state from profile');

    return (
      <Footer>
        <FooterTab
          style={{
            backgroundColor: '#fff'
          }}
        >
          {/*MOOV */}
          <Button
            style={{
              height: this.state.currentTab === 'MOOV' ? 70: '100%',
              width: this.state.currentTab === 'MOOV'? 70: '100%',
              bottom: this.state.currentTab === 'MOOV' ? 4 : 0,
              borderWidth: this.state.currentTab === 'MOOV' ? 1: 0,
              borderColor: this.state.currentTab === 'MOOV' ? '#b3b4b4' : 'white',
              borderRadius: this.state.currentTab === 'MOOV' ? 35: 0,
              // backgroundColor: this.state.currentTab === 'MOOV' ? '#fff' : '#fff'
              backgroundColor: this.state.currentTab === 'MOOV' && Platform.OS === 'android' ? '#b3b4b4' : '#fff'
            }}
            active={this.state.currentTab === 'MOOV'}
            onPress={() => this.setCurrentTab('MOOV')}
            badge
            vertical
          >
            {/*<Badge>*/}
            {/*<Text>2</Text>*/}
            {/*</Badge>*/}

            <Icon
              name="ios-car-outline"
              type="ionicon"
              color={this.state.currentTab === 'MOOV' ? 'black' : '#b3b4b4'}
            />
            <Text
              style={{
                fontSize: 10,
                color: this.state.currentTab === 'MOOV' ? 'black' : '#b3b4b4'
              }}
            >
              MOOV
            </Text>
          </Button>

          {/*Wallet*/}
          <Button
            style={{
              height: this.state.currentTab === 'WALLET' ? 70: '100%',
              width: this.state.currentTab === 'WALLET'? 70: '100%',
              bottom: this.state.currentTab === 'WALLET' ? 4 : 0,
              borderWidth: this.state.currentTab === 'WALLET' ? 1: 0,
              borderColor: this.state.currentTab === 'WALLET' ? '#b3b4b4' : 'white',
              borderRadius: this.state.currentTab === 'WALLET' ? 35: 0,
              // backgroundColor: this.state.currentTab === 'WALLET' ? '#fff' : '#fff'
              backgroundColor: this.state.currentTab === 'WALLET' && Platform.OS === 'android' ? '#b3b4b4' : '#fff'
            }}
            active={this.state.currentTab === 'WALLET'}
            onPress={() => this.setCurrentTab('WALLET')}
            badge
            vertical
          >
            {/*<Badge>*/}
            {/*<Text>2</Text>*/}
            {/*</Badge>*/}
            <Icon
              name="wallet"
              type="entypo"
              color={this.state.currentTab === 'WALLET' ? 'black' : '#b3b4b4'}
            />
            <Text
              style={{
                fontSize: 10,
                color: this.state.currentTab === 'WALLET' ? 'black' : '#b3b4b4'
              }}
            >{this.state.user.wallet_amount}</Text>
          </Button>

          {/*Ask*/}
          <Button
            style={{
              height: this.state.currentTab === 'ASK' ? 70: '100%',
              width: this.state.currentTab === 'ASK'? 70: '100%',
              bottom: this.state.currentTab === 'ASK' ? 4 : 0,
              borderWidth: this.state.currentTab === 'ASK' ? 1: 0,
              borderColor: this.state.currentTab === 'ASK' ? '#b3b4b4' : 'white',
              borderRadius: this.state.currentTab === 'ASK' ? 35: 0,
              // backgroundColor: this.state.currentTab === 'ASK' ? '#fff' : '#fff'
              backgroundColor: this.state.currentTab === 'ASK' && Platform.OS === 'android' ? '#b3b4b4' : '#fff'
            }}
            active={this.state.currentTab === 'ASK'}
            onPress={() => this.setCurrentTab('ASK')}
            badge
            vertical
          >
            {/*<Badge>*/}
            {/*<Text>2</Text>*/}
            {/*</Badge>*/}
            <Icon
              name="email-secure"
              type="material-community"
              color={this.state.currentTab === 'ASK' ? 'black' : '#b3b4b4'}
            />
            <Text
              style={{
                fontSize: 10,
                color: this.state.currentTab === 'ASK' ? 'black' : '#b3b4b4'
              }}
            >ASK</Text>
          </Button>

          {/*Profile*/}

          <Button
            style={{
              height: this.state.currentTab === 'PROFILE' ? 70: '100%',
              width: this.state.currentTab === 'PROFILE'? 70: '100%',
              bottom: this.state.currentTab === 'PROFILE' ? 4 : 0,
              borderWidth: this.state.currentTab === 'PROFILE' ? 1: 0,
              borderColor: this.state.currentTab === 'PROFILE' ? '#b3b4b4' : 'white',
              borderRadius: this.state.currentTab === 'PROFILE' ? 35: 0,
              // backgroundColor: this.state.currentTab === 'PROFILE' ? '#fff' : '#fff'
              backgroundColor: this.state.currentTab === 'PROFILE' && Platform.OS === 'android' ? '#b3b4b4' : '#fff'
            }}
            active={this.state.currentTab === 'PROFILE'}
            onPress={() => this.setCurrentTab('PROFILE')}
            badge
            vertical
          >
            {
              this.state.notificationCount === 0
              ? <Thumbnail
                  small
                  source={{
                    uri: this.state.user.image_url === ''
                    ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973461_1280.png'
                    : this.state.user.image_url
                  }}
                />
                : <Content>
                    <Badge>
                      <Text style={{
                        textAlign: 'center'
                      }}>{this.state.notificationCount}</Text>
                    </Badge>
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'red'
                      }}
                    >
                      {this.state.notificationCount > 1 ? 'MULTIPLE' : this.state.notificationType}
                    </Text>
                </Content>
            }
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export { FooterComponent }
