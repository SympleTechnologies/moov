// react library
import React, { Component } from 'react';

// react-native library
import { AsyncStorage, StyleSheet } from 'react-native';

// third-party library
import { Container, Text, Root } from 'native-base';

// common
import { HeaderComponent } from "../common";

class AskHomepage extends Component {

  state={
    userToken: '',
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

  render() {
    console.log(this.state);
    const { container } = styles;

    return (
      <Root>
        <Container style={container}>
          <HeaderComponent
            // options={this.state.schoolList}
            // onValueChange={(filter) => this.setState({ selectedSlot: filter })}
            // selectedOptions={this.state.selectedSlot ? this.state.selectedSlot : this.state.schoolList[0]}
          />
          <Text>Ask Page</Text>
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

export { AskHomepage }
