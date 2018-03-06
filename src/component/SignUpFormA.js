// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';

// third-party libraries
// import PhoneNumberPicker from '../country-picker/react-native-country-code-telephone-input';
import PhoneNumberPicker from 'react-native-country-code-telephone-input';

// common
// import { StatusBarComponent } from "../common";

const SignUpFormA =
  ({ onChange }) => {
    const { container, progressBar } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View style={container}>
        <Image
          style={progressBar}
          source={require('../../assets/formA.png')}
        />
        <View>
          <View>
            <View style={{ height: height / 5}}>
              <PhoneNumberPicker
                style={{ width: 10, height: 10}}
                countryHint={{name: 'Nigeria', cca2: 'NG', callingCode:"234"}}
                onChange={onChange} />
            </View>
            <View style={{ height: height / 5, alignItems: 'center'}}>
              <Text>Email</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height
  },
  progressBar: {
    width: Dimensions.get('window').width / 1,
    height: Dimensions.get('window').height / 10
  }

});

export { SignUpFormA };