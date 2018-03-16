// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Linking } from 'react-native';

// third-part library
import { Caption } from '@shoutem/ui';

// common
import { ButtonComponent, Input, StatusBarComponent } from "../common";

const SignUpForm =
  ({
     onSubmit,
     buttonText,
     onChangeFirstNameText,
     onChangeLastNameText,
     onChangeEmailText,
     onChangePasswordText,
     onChangeConfirmPasswordText,
     firstNameValue,
     lastNameValue,
     emailValue,
     passwordValue,
     confirmPasswordValue,
     errorMessage,
   }) => {
    const { container, form, landingPageBodyText, signInStyle, TextShadowStyle } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input
            autoCapitalize='words'
            autoFocus placeholder='First Name'
            onChangeText={onChangeFirstNameText}
            value={firstNameValue} />
        </View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input
            autoCapitalize='words'
            placeholder='Last Name'
            onChangeText={onChangeLastNameText}
            value={lastNameValue} />
        </View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input
            autoCapitalize='none'
            placeholder='name@example.com'
            onChangeText={onChangeEmailText}
            value={emailValue} />
        </View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input
            autoCapitalize='none'
            onChangeText={onChangePasswordText}
            placeholder={'Password'}
            secureTextEntry
            value={passwordValue} />
        </View>
        <View style={{ height: height / 10, alignItems: 'center'}}>
          <Input
            autoCapitalize='none'
            onChangeText={onChangeConfirmPasswordText}
            placeholder={'Confirm Password'}
            secureTextEntry
            value={confirmPasswordValue} />
        </View>
        <View style={{ height: height / 15, alignItems: 'center', flexDirection: 'column'}}>
          <View>
            {/*<ButtonComponent onPress={onSubmit} backgroundColor='#f68d65' text='Sign Up' />*/}
            <TouchableOpacity style={{ alignItems: 'center'}} onPress={onSubmit}>
              <Text
                style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: width / 1.5, marginTop: 10, flexDirection: 'column' }}>
            <Caption style={{ textAlign: 'center', color: '#333333', fontSize: 10 }}>By clicking on "Sign up", you accept the</Caption>
            <TouchableOpacity onPress={() => Linking.openURL('http://google.com')}>
              <Caption style={{ textAlign: 'center', color: '#ed1768', fontSize: 10 }}>Terms and Conditions</Caption>
            </TouchableOpacity>
            <Caption style={{ textAlign: 'center', color: '#333333', fontSize: 10 }}>of Use.</Caption>
          </View>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
  },
  form: {
    flexDirection: 'column',
    width: '50%'
  },
  landingPageBodyText: {
    color: '#b3b4b4',
    fontSize: 20,
    borderRadius: 15,
    padding: 8,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 3,
  },
  signInStyle: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    // textDecorationLine: 'underline',
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },

});

export { SignUpForm };