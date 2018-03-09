// react libraries
import React from 'react';

// react-native libraries
import { Text, Dimensions } from 'react-native';

// third-party libraries
import { TextInput } from '@shoutem/ui';

const Input = ({ onChangeText, value, errorMessage, autoFocus, secureTextEntry, keyboardType, placeholder, label, onSubmitEditing, autoCapitalize }) => {
  let { height, width } = Dimensions.get('window');
  return (
    <TextInput
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      autoFocus={autoFocus}
      keyboardAppearance="light"
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      placeholder={placeholder}
      // style={{ width: width / 1.5, color: '#333333' }}
      style={{ width: width / 1.5, color: '#333333', borderBottomColor: '#b3b4b4', borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: 'white'}}
      value={value}
      secureTextEntry={secureTextEntry}
    />
  )
};

export { Input };
