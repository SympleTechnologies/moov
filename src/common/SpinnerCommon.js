// react
import React, { Component } from 'react';

// third-part libraries
import { Container, Header, Content, Spinner } from 'native-base';

class SpinnerCommon extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Spinner color='rgba(92, 99,216, 1)' />
        </Content>
      </Container>
    );
  }
}

export { SpinnerCommon }
