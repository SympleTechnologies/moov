// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, Dimensions, Text } from 'react-native';

// common
import { StatusBarComponent } from "../common";

const SignUpFormC =
  ({ }) => {
    const { container, form } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View style={container}>
        <StatusBarComponent />
        <Text>Form 3</Text>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
  },
  form: {
    flexDirection: 'column',
    width: '50%'
  }

});

export { SignUpFormC };
