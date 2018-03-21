// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Linking } from 'react-native';

// common
import { ButtonComponent, Input, StatusBarComponent } from "../common";

const SignInFormPage =
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
   }) => {
    const { container, form, landingPageBodyText, signInStyle, TextShadowStyle } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input
            autoCapitalize='none'
            placeholder='Email'
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
        <View style={{ height: height / 15, marginTop: 20, alignItems: 'center', flexDirection: 'column'}}>
          <View>
            <TouchableOpacity style={{ alignItems: 'center'}} onPress={onSubmit}>
              <Text
                style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
              >
                {buttonText}
              </Text>
              {/*<TouchableOpacity onPress={() => console.log('forget password')}>*/}
                {/*<Caption style={{ textAlign: 'center', color: '#ed1768', fontSize: 10 }}>Terms and Conditions</Caption>*/}
              {/*</TouchableOpacity>*/}
            </TouchableOpacity>
          </View>
          <View style={{ width: width / 1.5, flexDirection: 'column' }}>
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
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },

});

export { SignInFormPage };