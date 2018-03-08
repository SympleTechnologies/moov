// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, Dimensions, Text } from 'react-native';

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
    const { container, form } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input autoCapitalize='words' autoFocus placeholder='First Name' onChangeText={onChangeFirstNameText} value={firstNameValue}/>
        </View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input autoCapitalize='words' placeholder='Last Name' onChangeText={onChangeLastNameText} value={lastNameValue}/>
        </View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input autoCapitalize='none' placeholder='name@example.com' onChangeText={onChangeEmailText} value={emailValue}/>
        </View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <Input autoCapitalize='none' onChangeText={onChangePasswordText} placeholder={'Password'} secureTextEntry value={passwordValue} />
        </View>
        <View style={{ height: height / 10, alignItems: 'center'}}>
          <Input autoCapitalize='none' onChangeText={onChangeConfirmPasswordText} placeholder={'Confirm Password'} secureTextEntry value={confirmPasswordValue} />
        </View>
        <View style={{ height: height / 15, alignItems: 'center'}}>
          <ButtonComponent onPress={this.updateInfo} backgroundColor='#f68d65' text='NEXT' />
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
  }

});

export { SignUpForm };