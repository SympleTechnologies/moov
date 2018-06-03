import React from "react";
import { AppRegistry, Image, StatusBar } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
const routes = ["Ask","Moov", "Profile", "Transactions", "Wallet"];
class SideBar extends React.Component {
  render() {
    return (
      <Container style={{
	      backgroundColor: '#fafafa'
      }}>
        <Content
          contentContainerStyle={{
            marginTop: 50
          }}
        >
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(data)}>
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
