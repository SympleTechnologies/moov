// react library
import React, { Component } from 'react';

// react-native library
import { Platform } from 'react-native';

// third-party library
import { Container, Content, Footer, FooterTab, Button, Text, Root, Badge } from 'native-base';

import { Icon } from 'react-native-elements';


// container
import { MoovPage } from "../container";

class FooterComponent extends Component {

  state={
    currentTab: 'MOOV'
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
      this.setState({ currentTab: 'PROFILE' })
    }
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {

  }

  render() {
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
            >WALLET</Text>
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
            <Badge>
              <Text>2</Text>
            </Badge>
            <Icon
              name="person"
              color={this.state.currentTab === 'PROFILE' ? 'black' : '#b3b4b4'}
            />
            <Text
              style={{
                fontSize: 10,
                color: this.state.currentTab === 'PROFILE' ? 'black' : '#b3b4b4'
              }}
            >PROFILE</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export { FooterComponent }
