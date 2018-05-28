// react library
import React, { Component } from 'react';

// react-native library
import { Platform } from 'react-native';

// third-part libraries
import { Header, Left, Body, Right, Button, Text, Icon, Badge } from 'native-base';

// component
import { StatusBarComponent } from "../../common";

const HeaderComponent =  ({ onPress }) => {
  return (
    <Header
      style={{
        backgroundColor: '#fafafa'
      }}
    >
      <Left>
        <Button
          transparent
          onPress={onPress}>
          <Icon
            name="menu"
            style={{
              color: '#4b4f59'
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
          style={{
            color: '#4b4f59'
          }}
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
