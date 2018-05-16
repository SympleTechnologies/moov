// react library
import React, { Component } from 'react';

// react-native library
import { Image, Dimensions } from 'react-native';


// third-party library
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';

class CardCommon extends Component {

  state={
    text: ''
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.setState({
      text: this.props.text,
      value: this.props.value
    });
  }

  render() {
    let { height, width } = Dimensions.get('window');

    return (
      <Container>
        <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Thumbnail source={require('../../assets/appLogo.png')} />
                <Body>
                <Text>MOOV</Text>
                <Text note>Symple-Inc</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
              <Image source={require('../../assets/searching_location.png')} style={{height: 100, width: width, flex: 1}}/>
              <Text style={{ marginTop: 20, color: '#87838B' }}>
                { this.state.text }
              </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name="location-searching" type="MaterialIcons"/>
                  <Text>Fetching {this.state.value}...</Text>
                </Button>
              </Left>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

export { CardCommon }
