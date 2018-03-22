// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, Dimensions } from 'react-native';

// third-parties libraries
import RNPaystack from 'react-native-paystack';
import { Title,TextInput, Heading, Subtitle, Caption } from '@shoutem/ui';
import { FormInput, FormLabel } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';


// common
import {ButtonTextComponent, StatusBarComponent} from "../../common/index";

class TransferPage extends React.Component {
  state= {
    userToken: '',
    requestSlot: 'LOAD'
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
  }

  render() {
    console.log(this.state);
    let { height, width } = Dimensions.get('window');
    let slots = [ { value: 'LOAD', }, { value: 'TRANSFER', }, { value: 'WITHDRAW', } ];

    return (
      <View style={styles.container}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content" />
        <View style={{ flexDirection: 'column'}}>
          <View style={{ flexDirection: 'row', width: '70%', marginBottom: 10 }}>
            <View style={{ paddingTop: width / 34 }}>
              <Title>Enter Amount: </Title>
            </View>
            <View style={{ width: '70%'}}>
              <FormInput
                style={{ flexDirection: 'row', width: 1 }}
                keyboardType='numeric'
                placeholder={''}
                // onChangeText={...}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '70%'}}>
            <View style={{ paddingTop: width / 12 }}>
              <Title>Transaction: </Title>
            </View>
            <View style={{ width: '80%'}}>
              <View style={{ width: '70%', zIndex: -1, marginLeft: width / 10}}>
                <Dropdown
                  // label='slots'
                  // itemColor='blue'
                  data={slots}
                  value='LOAD'
                  onChangeText={ requestSlot => this.setState({ requestSlot }) }
                />
              </View>
            </View>
          </View>
          <View style={{ marginTop: 40 }}>
            <ButtonTextComponent
              // onPress={this.transferToEmail}
              buttonText='LOAD'
              iconName='payment'
              iconType='material'
              backgroundColor='#333'
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b3b4b4',
  },
});

export { TransferPage };
