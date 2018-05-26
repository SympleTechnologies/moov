// react library
import React, { Component } from 'react';

// third-part libraries
import { Header, Left, Body, Right, Button, Text, Icon, Badge } from 'native-base';

// component
import { StatusBarComponent } from "../../common";

const HeaderComponent =  ({ onPress }) => {
  return (
    <Header
      style={{
        backgroundColor: '#fff'
      }}
    >
      <Left>
        <Button
          transparent
          onPress={onPress}>
          <Icon
            name="menu"
            style={{
              color: 'black'
            }}
            raised={10}
          />
        </Button>
      </Left>
      <Body>
      <Button transparent>
        <Text style={{ color: '#d3000d', fontWeight: '900' }}>Moov</Text>
      </Button>
      </Body>
      <Right>
        <Icon
          name="notifications-none"
          type="MaterialIcons"
        />
        {/*<Badge>*/}
          {/*<Text style={{*/}

          {/*}}>2</Text>*/}
        {/*</Badge>*/}
      </Right>
      <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
    </Header>
  );
};

export { HeaderComponent }
