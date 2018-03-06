// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View } from 'react-native';
import { SignUpFormA, SignUpFormB, SignUpFormC } from "../component";

class SignUpPage extends React.Component {
  state= {
    countryName: '',
    callingCode: '',
    phoneNo:'',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {

  }

  PhoneNumberPickerChanged = (country, callingCode, phoneNumber) => {
    this.setState({countryName: country.name, callingCode: callingCode, phoneNo:phoneNumber});
  };

  render() {
    console.log(this.state);
    const { container } = styles;
    console.log(this.state);

    return (
        <SignUpFormA onChange={this.PhoneNumberPickerChanged}/>
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
});

export { SignUpPage };