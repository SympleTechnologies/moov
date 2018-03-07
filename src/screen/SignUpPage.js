// react libraries
import React from 'react';

// react-native libraries
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';

// third-part library
import PhoneInput from "react-native-phone-input";
import { Heading, Subtitle, Button, Icon } from '@shoutem/ui';
import Toast from 'react-native-simple-toast';

// common
import { StatusBarComponent, ButtonComponent } from "../common";

class SignUpPage extends React.Component {
  state= {
    stage: '1',
    isValidPhoneNumber: '',
    type: "",
    phoneNumber: "",
    isValidUserDetails: ''
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {

  }

  /**
   * updateInfo
   *
   * Updates phone number details
   * @return {void}
   */
  updateInfo = () => {
    this.setState({
      isValidPhoneNumber: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      phoneNumber: this.phone.getValue()
    });
  };

  renderInfo() {
    if (this.state.phoneNumber) {
      return (
        <View style={styles.info}>
          <Text>
            Is Valid:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {this.state.isValidPhoneNumber.toString()}
            </Text>
          </Text>
          <Text>
            Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
          </Text>
          <Text>
            Value:{" "}
            <Text style={{ fontWeight: "bold" }}>{this.state.phoneNumber}</Text>
          </Text>
        </View>
      );
    }
  }

  render() {
    const { container, container1, stageOneStyle, button, progressBar } = styles;
    let { height, width } = Dimensions.get('window');
    console.log(this.state);

    if(this.state.isValidPhoneNumber === false) {
      Toast.show('You have entered an invalid phone number.', Toast.LONG);
    }

    if(this.state.isValidUserDetails) {
      return (
        <View style={container1}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <View style={{ height: height / 10}}>
            <Heading>One click away.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../assets/formC.png')}
          />
          <View>
            <View>
              <View style={{ height: height / 5, width: width / 1.5}}>
                <View style={stageOneStyle}>
                  <PhoneInput
                    ref={ref => {
                      this.phone = ref;
                    }}
                  />
                </View>
              </View>
              <View style={{ height: height / 5, alignItems: 'center'}}>
                <Text>Email</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }

    if(this.state.isValidPhoneNumber) {
      return (
        <View style={container1}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <View style={{ height: height / 10}}>
            <Heading>Some more details.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../assets/formB.png')}
          />
          <View>
            <View>
              <View style={{ height: height / 10, alignItems: 'center'}}>
                <Text>First Name</Text>
              </View>
              <View style={{ height: height / 10, alignItems: 'center'}}>
                <Text>First Name</Text>
              </View>
              <View style={{ height: height / 10, alignItems: 'center'}}>
                <Text>First Name</Text>
              </View>
              <View style={{ height: height / 10, alignItems: 'center'}}>
                <Text>First Name</Text>
              </View>
              <View style={{ height: height / 10, alignItems: 'center'}}>
                <Text>First Name</Text>
              </View>
              <View style={{ height: height / 10, alignItems: 'center'}}>
                <Text>First Name</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }

    if(this.state.stage === '1') {
      return (
        <View style={container1}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <View style={{ height: height / 10}}>
            <Heading>Get MOOVING.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../assets/formA.png')}
          />
          <View>
            <View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
                <Subtitle>Enter your phone number:</Subtitle>
              </View>
              <View style={{ height: height / 5, width: width / 1.5}}>
                <View style={stageOneStyle}>
                  <PhoneInput
                    ref={ref => {
                      this.phone = ref;
                    }}
                    autoFocus
                  />
                  {/*{this.renderInfo()}*/}
                </View>
              </View>

              <View style={{ height: height / 15, alignItems: 'center'}}>
                <ButtonComponent onPress={this.updateInfo} backgroundColor='#f68d65' text='NEXT' />
              </View>
            </View>
          </View>
        </View>
      )
    }

    return (
      {/*<SignUpFormA onChange={this.PhoneNumberPickerChanged}/>*/}
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  container1: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height
  },
  progressBar: {
    width: Dimensions.get('window').width / 1,
    height: Dimensions.get('window').height / 10
  },
  stageOneStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff',
    padding: 20,
  },
  info: {
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginTop: 20
  },
  button: {
    marginTop: 20,
    padding: 10
  }
});

export { SignUpPage };