// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';

// third-party libraries
import RNFetchBlob from 'react-native-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import {StatusBarComponent} from "../common";
import { Avatar, Card, ListItem, Button } from 'react-native-elements'
import * as axios from "axios/index";

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
window.Blob = Blob

class ProfileHomepage extends React.Component {
  state= {
    userToken: '',
    loading: false,

    user: {
      image_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973461_1280.png'
,    }
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
    AsyncStorage.getItem("user").then((value) => {
      this.setState({ user: JSON.parse(value) });
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
        this.setState({ loading: !this.state.loading });
        this.uploadImage(response)
          .then(response => {
            console.log(response);
            console.log(JSON.parse(response.data), 'from cloud');
            this.saveImageURL(JSON.parse(response.data))
          })
          .catch((err) => {
            console.log(err, err.message);
            this.setState({ loading: !this.state.loading });
            Toast.showWithGravity(`${err.message}`, Toast.LONG, Toast.TOP);
          })
      }
    });

  };

  /**
   * update user's image at the back end
   *
   * @param {strinh} data - user image url from cloud
   */
  saveImageURL = (data) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';


    axios.put('https://moov-backend-staging.herokuapp.com/api/v1/user',
      {
        "image_url": data.secure_url,
      }
    )
      .then((response) => {
        console.log(response.data.data);
        this.setState({ user: response.data.data.user }, () => this.updateLoacalStorage(response.data.data.user));
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
      })
      .catch((error) => {
        console.log(error.response);
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });
  };

  /**
   * updateLoacalStorage
   *
   * updates user in the LoacalStorage
   * @param {object} user - new user object from the backend
   */
  updateLoacalStorage = (user) => {
    AsyncStorage.setItem('user', JSON.stringify(user));
    this.setState({ loading: !this.state.loading });
  };

  render() {
    console.log(this.state);
    const { container, activityIndicator } = styles;
    let { height, width } = Dimensions.get('window');

    // let img = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973461_1280.png';



    // ACTIVITY INDICATOR
    if (this.state.loading) {
      return (
        <View style={{flex: 1, backgroundColor: 'white' }}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <ActivityIndicator
            color = '#004a80'
            size = "large"
            style={activityIndicator}
          />
        </View>
      );
    }

    return (
      <View style={container}>
        <StatusBarComponent style={{ height: (Platform.OS === 'ios') ? 60 : 0 }} />
        <View>
          <View style={{ height: height / 2.5, backgroundColor: '#004a80', marginTop: (Platform.OS === 'ios') ? 20 : 0 }}>
            <ImageBackground
              style={{width: width, height: '100%'}}
              blurRadius={1}
              opacity={0.9}
              source={{uri: `${this.state.user.image_url}`, cache: 'force-cache'}}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                  xlarge
                  rounded
                  source={{uri: `${this.state.user.image_url}`, cache: 'force-cache'}}
                  onPress={() => this.getImage()}
                  activeOpacity={0.7}
                />
              </View>
            </ImageBackground>
          </View>
          <View style={{ height: height / 2.5}}>

          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b3b4b4',
    height: Dimensions.get('window').height
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { ProfileHomepage };