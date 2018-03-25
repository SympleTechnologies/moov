// react libraries
import React from 'react';

// react-native libraries
import { StyleSheet, Text, View, AsyncStorage, TouchableOpacity } from 'react-native';

// third-party libraries
import RNFetchBlob from 'react-native-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import Toast from "react-native-simple-toast";

// More info on all the options is below in the README...just some common use cases shown here
let options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class ProfileHomepage extends React.Component {
  state= {
    userToken: '',
    image_url: '',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      this.setState({ userToken: value });
    }).done();
  }

  /**
   * uploadImage
   *
   * uploads user image to cloudinary
   * @param file
   * @return {Promise}
   */
  uploadImage = (file) => {
    this.setState({
      loading: true
    });

    return RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/moov/image/upload?upload_preset=kih6v8fp', {
      'Content-Type': 'multipart/form-data'
    }, [
      { name: 'file', filename: file.fileName, data: RNFetchBlob.wrap(file.origURL) }
    ])
  };

  /**
   * getImage
   *
   * get user's image from phone
   */
  getImage = () => {

    this.setState({
      uploadingImg: true
    });

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.uploadImage(response)
          .then(response => {
            console.log(response);
            console.log(JSON.parse(response.data), 'from cloud');
            this.saveImageURL(JSON.parse(response.data))
          })
          .catch((err) => {
            console.log(err, err.message);
            this.setState({
              loading: false
            });
            Toast.showWithGravity(`${err.message}`, Toast.LONG, Toast.TOP);
          })
      }
    });

  };

  saveImageURL = (data) => {
    // console.log(data, 'from save');
    // console.log(data.secure_url, 'from save');

    this.setState({
      image_url: data.secure_url
    })
  };

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.getImage()}>
          <Text>Profile Pages</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b3b4b4'
  },
});

export { ProfileHomepage };