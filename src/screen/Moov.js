// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, Platform } from 'react-native';

// third-party library
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge } from 'native-base';

// container
import { MoovPage } from "../container";

// common
import { StatusBarComponent } from "../common";

class Moov extends Component {

  state={
  };


  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {

  };

  /**
   * setCurrentTab
   *
   * sets the state of the current tab as user clicks
   * @param {string} currentTab - clicked tab
   * @return {void}
   */
  setCurrentTab = (currentTab) => {
    console.log(currentTab);

    if(currentTab === 'MOOV') {
      this.setState({ currentTab: 'MOOV' })
    }

    if(currentTab === 'WALLET') {
      this.setState({ currentTab: 'WALLET' })
    }

    if(currentTab === 'ASK') {
      this.setState({ currentTab: 'ASK' })
    }

    if(currentTab === 'PROFILE') {
      this.setState({ currentTab: 'PROFILE' })
    }
  };

  /**
   * renderContent
   *
   * renders the body of the page
   * @return {void}
   */
  renderContent = () => {
    if(this.state.currentTab === 'MOOV') {
      return (
        <MoovPage />
      )
    }

    if(this.state.currentTab === 'WALLET') {

    }

    if(this.state.currentTab === 'ASK') {

    }

    if(this.state.currentTab === 'PROFILE') {

    }
  };

  render() {
    return (
        <Container>

          {/*Header*/}
          <Header
            style={{
              backgroundColor: '#fff'
            }}
          >
            <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
          </Header>

          {/*Body*/}
          <Content>
            {this.renderContent()}
          </Content>

          {/*Footer*/}
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
                  backgroundColor: this.state.currentTab === 'MOOV' && Platform.OS === 'android' ? '#b3b4b4' : '#fff'
                }}
                active={this.state.currentTab === 'MOOV'}
                onPress={() => this.setCurrentTab('MOOV')}
                badge
                vertical
              >
                <Badge>
                  <Text>2</Text>
                </Badge>
                <Icon
                  // style={{ color: this.state.currentTab === 'MOOV' ? 'black' : '#b3b4b4' }}
                  name="cab"
                  type="FontAwesome"
                />
                <Text
                  style={{
                    fontSize: 10,
                    // color: this.state.currentTab === 'MOOV' ? 'lightblue' : '#b3b4b4'
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
                  backgroundColor: this.state.currentTab === 'WALLET' && Platform.OS === 'android' ? '#b3b4b4' : '#fff'
                }}
                active={this.state.currentTab === 'WALLET'}
                onPress={() => this.setCurrentTab('WALLET')}
                badge
                vertical
              >
                <Badge>
                  <Text>2</Text>
                </Badge>
                <Icon name="camera" />
                <Text style={{ fontSize: 10 }}>WALLET</Text>
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
                  backgroundColor: this.state.currentTab === 'ASK' && Platform.OS === 'android' ? '#b3b4b4' : '#fff'
                }}
                active={this.state.currentTab === 'ASK'}
                onPress={() => this.setCurrentTab('ASK')}
                badge
                vertical
              >
                <Badge>
                  <Text>2</Text>
                </Badge>
                <Icon active name="navigate" />
                <Text style={{ fontSize: 10 }}>ASK</Text>
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
                <Icon name="person" />
                <Text style={{ fontSize: 10 }}>PROFILE</Text>
              </Button>


            </FooterTab>
          </Footer>
        </Container>
    );
  }
}

export { Moov }
