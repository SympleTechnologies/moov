// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';

// common
import { StatusBarComponent } from "../common";

const SignUpFormA =
  ({ }) => {
    const { container, progressBar } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <View style={container}>
        <Image
          style={progressBar}
          source={require('../../assets/formA.png')}
        />
        <View>
          <View style={{ height: height / 10}}>
            <Text>Phone Number</Text>
          </View>
          <View style={{ height: height / 10}}>
            <Text>Next</Text>
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