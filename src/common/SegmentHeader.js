// react libraries
import React, { Component } from 'react';

// react-native libraries
import { Container, Header, Left, Body, Right, Button, Icon, Title, Segment, Content, Text } from 'native-base';
import {StatusBarComponent} from "./StatusBarComponent";

class SegmentHeader extends Component {
  render() {
    console.log(this.props);
    return (
      <Container>
        {/*<Header*/}
          {/*hasTabs*/}
          {/*style={{*/}
            {/*backgroundColor: '#fff'*/}
          {/*}}*/}
        {/*>*/}
          {/*<Left>*/}
            {/*<Button transparent>*/}
              {/*<Icon name="arrow-back" />*/}
            {/*</Button>*/}
          {/*</Left>*/}
          {/*<Body>*/}
          {/*<Title style={{ color: 'black' }}>{this.props.title}</Title>*/}
          {/*</Body>*/}
          {/*<Right>*/}
            {/*<Button*/}
              {/*transparent*/}
            {/*>*/}
              {/*/!*<Icon name="search" />*!/*/}
              {/*<Text style={{ color: 'black' }}>{this.props.amount}</Text>*/}
            {/*</Button>*/}
          {/*</Right>*/}
          {/*<StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />*/}
        {/*</Header>*/}
        {/*<Segment>*/}
          {/*<Button*/}
            {/*style={{*/}
              {/*borderWidth: 1,*/}
              {/*borderColor: '#007aff'*/}
            {/*}}*/}
            {/*first>*/}
            {/*<Text>Puppies</Text>*/}
          {/*</Button>*/}
          {/*<Button*/}
            {/*style={{*/}
              {/*borderWidth: 1,*/}
              {/*borderColor: '#007aff'*/}
            {/*}}*/}
            {/*active={true}>*/}
            {/*<Text>Kittens</Text>*/}
          {/*</Button>*/}
          {/*<Button*/}
            {/*style={{*/}
              {/*borderWidth: 1,*/}
              {/*borderColor: '#007aff',*/}
              {/*backgroundColor: '#fff'*/}
            {/*}}*/}
            {/*last>*/}
            {/*<Text style={{ color: '#007aff' }}>Cubs</Text>*/}
          {/*</Button>*/}
        {/*</Segment>*/}
        {/*<Content padder>*/}
          {/*<Text>Awesome segment</Text>*/}
        {/*</Content>*/}
      </Container>
    );
  }
}

export { SegmentHeader }
