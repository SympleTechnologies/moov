// react libraries
import React from 'react';

// react-native libraries
import { Text, Dimensions } from 'react-native';

// third-part library
import { Button } from '@shoutem/ui';

const ButtonComponent = ({ backgroundColor, text, onPress}) => {
  let { height, width } = Dimensions.get('window');

  return (
    <Button onPress={onPress} style={{ width: width / 3, backgroundColor: backgroundColor, borderRadius: 15}} styleName="confirmation dark">
      <Text>{text}</Text>
    </Button>
  )
}

export { ButtonComponent };
