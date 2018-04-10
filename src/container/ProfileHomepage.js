// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,

  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';

// third-party libraries
import RNFetchBlob from 'react-native-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import Toast from "react-native-simple-toast";
import {StatusBarComponent} from "../common";
import { Avatar, Card, ListItem, Button, Icon } from 'react-native-elements'
import * as axios from "axios/index";
import { Title, ImageBackground, Overlay, Tile, DropDownMenu, Subtitle, Caption, Heading, Image, Divider } from '@shoutem/ui';
import { TransactionPage, NotificationPage } from "../component/Profile";


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
,    },

    activeTab: 'notifications',
    notifications: [],
    basicInfo: {},
    transactions: []
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    AsyncStorage.getItem("token").then((value) => {
      this.setState({ userToken: value }, () => {
        this.getNotifications();
      });

    }).done();
    AsyncStorage.getItem("user").then((value) => {
      this.setState({ user: JSON.parse(value) });
    }).done();
  }

  /**
   * getNotifications
   *
   * Get all User's notifications
   * @return {void}
   */
  getNotifications = () => {
    this.setState({ activeTab: 'notifications' });

    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.get('https://moov-backend-staging.herokuapp.com/api/v1/notification')
      .then((response) => {
        this.setState({
          notifications: response.data.data
        })
      })
      .catch((error) => {
        console.log(error.response);
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });
  };

  /**
   * getBasicInformation
   *
   * Get all User's basic information
   * @return {void}
   */
  getBasicInformation = () => {
    this.setState({ activeTab: 'basic-info' });

    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.get('https://moov-backend-staging.herokuapp.com/api/v1/basic_info')
      .then((response) => {
        this.setState({
          user: response.data.data.user,
          basicInfo: response.data.data.user
        });
      })
      .catch((error) => {
        console.log(error.response);
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });
  };

  /**
   * getTransaction
   *
   * Get all User's transaction
   * @return {void}
   */
  getTransaction = () => {
    this.setState({ activeTab: 'transactions' });
  };

  /**
   * renderBody
   *
   * reders the body part of the profile page
   * @return {*}
   */
  renderBody = () => {
    let { height } = Dimensions.get('window');

    if(this.state.activeTab === 'notifications' && this.state.notifications.all_count > 0) {
      return (
        <View>
          <NotificationPage notification={this.state.notifications} userToken={this.state.userToken}/>
        </View>
      );
    }

    if(this.state.activeTab === 'basic-info' && Object.keys(this.state.basicInfo).length > 0) {
      return (
        <Text>Basic Information</Text>
      );
    }

    if(this.state.activeTab === 'transactions') {
      return (
        <View>
          <TransactionPage userEmail={this.state.user.email} />
        </View>
      );
    }

    return (
      <View style={{ marginTop: height / 5,  backgroundColor: 'white' }}>
        <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
        <ActivityIndicator
          color = '#004a80'
          size = "large"
        />
      </View>
    )
  };

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
    console.log(this.state.notifications.length);
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
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" style={{ height: (Platform.OS === 'ios') ? 60 : 0 }} />
        <View>
          <View style={{ height: height / 3, backgroundColor: '#004a80', marginTop: (Platform.OS === 'ios') ? 20 : 0 }}>
            <ImageBackground
              styleName="large"
              source={{uri: `${this.state.user.image_url}`, cache: 'force-cache'}}
            >
              <Tile>
                <Overlay>
                  <Title styleName="md-gutter-bottom">{`${this.state.user.firstname} ${this.state.user.firstname}`}</Title>
                  <Caption>{`UPLOAD`}</Caption>
                </Overlay>
              </Tile>
            </ImageBackground>
          </View>
          <View style={{ width: width }}>
            <Divider styleName="section-header">

              {/*Notification Section*/}
              <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity
                  onPress={this.getNotifications}
                >
                  <Icon
                    name="notification"
                    type="entypo"
                    color={ this.state.activeTab === 'notifications' ? '#333' : "#b3b4b4" }
                  />
                  <Caption
                    style={{
                      color: this.state.activeTab === 'notifications' ? '#333' :'#b3b4b4',
                      fontSize: 10
                    }}
                  >
                    NOTIFICATIONS
                  </Caption>
                </TouchableOpacity>
              </View>

              {/*Basic Information*/}
              <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity
                  onPress={this.getBasicInformation}
                >
                  <Icon
                    name="information"
                    type="material-community"
                    color={ this.state.activeTab === 'basic-info' ? '#333' : "#b3b4b4" }
                  />
                  <Caption
                    style={{
                      color: this.state.activeTab === 'basic-info' ? '#333' :'#b3b4b4',
                      fontSize: 10
                    }}
                  >
                    BASIC INFO
                  </Caption>
                </TouchableOpacity>
              </View>

              {/*Free rides Section*/}
              <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ activeTab: 'rides' })}
                >
                  <Icon
                    name="gift"
                    type="font-awesome"
                    color={ this.state.activeTab === 'rides' ? '#333' : "#b3b4b4" }
                  />
                  <Caption
                    style={{
                      color: this.state.activeTab === 'rides' ? '#333' :'#b3b4b4',
                      fontSize: 10
                    }}
                  >
                    FREE RIDES
                  </Caption>
                </TouchableOpacity>
              </View>

              {/*Transactions Section*/}
              <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity
                  onPress={this.getTransaction}
                >
                  <Icon
                    name="account-balance"
                    type="material"
                    color={ this.state.activeTab === 'transactions' ? '#333' : "#b3b4b4" }
                  />
                  <Caption
                    style={{
                      color: this.state.activeTab === 'transactions' ? '#333' :'#b3b4b4',
                      fontSize: 10
                    }}
                  >
                    TRANSACTIONS
                  </Caption>
                </TouchableOpacity>
              </View>
            </Divider>
          </View>
          <View>
            {
              this.renderBody()
            }
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