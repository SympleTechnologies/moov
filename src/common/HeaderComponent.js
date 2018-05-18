// react library
import React, { Component } from 'react';

// third-part libraries
import { Container, Header, Left, Body, Right, Button, Text } from 'native-base';
import { DropDownMenu } from '@shoutem/ui';

// component
import { StatusBarComponent } from "../common";

const HeaderComponent =  ({ options, onValueChange, selectedOptions, priceValue, priceColor }) => {
    return (
      <Container>
        <Header
          style={{
            backgroundColor: '#fff'
          }}
        >
          <Left>
            <Button transparent>
              <DropDownMenu
                options={options}
                selectedOption={selectedOptions}
                onOptionSelected={onValueChange}
                titleProperty="name"
                valueProperty="value"
                visibleOptions={10}
                vertical
              />
            </Button>
          </Left>
          <Body>
          <Button transparent>
            <Text style={{ color: 'black' }}>MOOV</Text>
          </Button>
          </Body>
          <Right>
            <Button transparent>
              <Text style={{ color: priceColor, fontSize: 15 }}>{priceValue}</Text>
            </Button>
          </Right>
          <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        </Header>
      </Container>
    );
  };

export { HeaderComponent }
