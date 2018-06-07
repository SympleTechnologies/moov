// react libraries
import React from "react";

// third-party libraries
import { Container, Content, Text, List, ListItem } from "native-base";

// routes
const routes = ["Ask","Homepage", "Profile", "Transactions", "Wallet"];

class SideBar extends React.Component {
	
	/**
	 * componentDidMount
	 *
	 * React life-cycle method sets user token
	 * @return {void}
	 */
	componentDidMount() {
	
	};
	
  render() {
    return (
      <Container style={{
	      backgroundColor: '#fff'
      }}>
        <Content>
          <List
	          style={{
		          marginTop: 90
	          }}
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.tab === data ? '' : this.props.navigateToTabPage(data)}>
                  <Text>{data}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}

export {SideBar}
