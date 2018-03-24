// react libraries
import React from 'react';

// react-native libraries
import { View } from 'react-native';

// third-party libraries
import { Button } from 'react-native-elements'

const ButtonTextComponent = ({ onPress, text, buttonText, iconName, iconType, backgroundColor }) => {

  return (
    <View>
      <Button
        backgroundColor={backgroundColor}
        onPress={onPress}
        title={buttonText}
        icon={{ name: iconName, type: iconType, buttonStyle: { width: 30 } }}
      />
    </View>
  )
};

export { ButtonTextComponent };