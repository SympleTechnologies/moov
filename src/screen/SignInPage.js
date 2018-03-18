// react libraries
import React from 'react';

// react-native libraries
import {StyleSheet, Text, View, ImageBackground, Dimensions} from 'react-native';
import {StatusBarComponent} from "../common";
import * as axios from "axios/index";
import Toast from "react-native-simple-toast";

class SignInPage extends React.Component {
  state= {
    userToken: '',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {

  }

  saveUserToServer = () => {
    this.setState({ loading: !this.state.loading });
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/signup', {
      "user_type": "student",
      "firstname":  this.state.firstName ,
      "lastname": this.state.lastName,
      "email": this.state.email,
      "image_url": this.state.imgURL,
      "mobile_number": this.state.phoneNumber
    })
      .then((response) => {
        this.setState({ loading: !this.state.loading, userCreated: !this.state.userCreated });
        console.log(response);
        this.signUpSuccess(response);
        // Toast.show(`${response.data.data.message}`, Toast.LONG);
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        console.log(error.response.data);
        console.log(error.response.data.data.message);
        Toast.show(`${error.response.data.data.message}`, Toast.LONG);
        console.log(error.message);
      });
  };

  render() {
    console.log(this.state);

    const { container } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View style={container}>
        <ImageBackground
          style={{ height: height, width: width}}
          source={{uri: 'https://cdn.dribbble.com/users/410907/screenshots/1641559/yellow_cab.jpg'}}
        >
          <StatusBarComponent/>
          <Text>Sign In Page</Text>
        </ImageBackground>
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
  },
});

export { SignInPage };