// react libraries
import React from 'react';

// react-native libraries
import { Text, Dimensions } from 'react-native';

// third-part library
import { Button, Icon } from '@shoutem/ui';

const ButtonIconComponent = ({ backgroundColor, text, onPress}) => {
  let { height, width } = Dimensions.get('window');

  return (
    <Button onPress={onPress} style={{ width: width / 3, backgroundColor: backgroundColor, borderRadius: 30 }} styleName="confirmation dark">
      <Icon name="like" />
      <Text>{text}</Text>
    </Button>
  )

  // return (
  //   <Button onPress={onPress} style={{ width: width / 3, backgroundColor: backgroundColor, borderRadius: 30 }} styleName="confirmation dark">
  //     <Text>{text}</Text>
  //   </Button>
  // )
}

export { ButtonIconComponent };
