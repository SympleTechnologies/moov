// react libraries
import React, { Component } from 'react';

// react-native libraries
import { Dimensions, View, Text } from 'react-native';

// third-party libraries
import { Row, ListView, Caption, Subtitle, Divider, Image, Spinner } from '@shoutem/ui';
import { Icon } from 'react-native-elements';
import Toast from "react-native-simple-toast";
import * as axios from "axios/index";

class NotificationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsArray: [],
      notification:{},
      userToken: '',
      loading: false
    }
  }

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.setState({
      notification: this.props.notification,
      notificationsArray: this.props.notification.notifications,
      userToken: this.props.userToken
    })
  }

  /**
   * onRefresh
   *
   * Fetches the latest notifications
   */
  onRefresh = () => {
    this.setState({
      loading: true
    });

    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.get('https://moov-backend-staging.herokuapp.com/api/v1/notification')
      .then((response) => {
        this.setState({
          notification: response.data.data,
          notificationsArray: response.data.data.notifications,
        }, () => this.stopSpinner())
      })
      .catch((error) => {
        console.log(error.response);
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });
  };

  /**
   * stopSpinner
   *
   * stops the onRefresh Spinner by updating state
   */
  stopSpinner = () => {
    this.setState({
      loading: false
    })
  };

  /**
   * renderHeader
   *
   * renders Header
   * @return {*}
   */
  renderHeader = () => {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <Icon
          name="chevron-up"
          type="entypo"
          color={ "#b3b4b4" }
        />
      </View>
    )
  };

  /**
   * renderFooter
   *
   * shows footer instruction
   * @return {*}
   */
  renderFooter = () => {
    let { height } = Dimensions.get('window');
    return (
      <View style={{ backgroundColor: 'white', height: height / 10 }}>
        {
          this.state.notification.next_url !== null
          ? <Spinner style={{  marginTop: height / 30 }} />
          : <Caption style={{ textAlign: 'center', marginTop: height / 30 }}>End</Caption>
        }
      </View>
    )
  };

  /**
   * onLoadMore
   *
   * loads other pages
   * @return {*}
   */
  onLoadMore = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    return this.state.notification.next_url !== null
    ?

    axios.get(`${this.state.notification.next_url}`)
      .then((response) => {
        console.log(response.data.data);
        this.setState({
          notification: response.data.data,
          notificationsArray: this.state.notificationsArray.concat(response.data.data.notifications)
        });
      })
      .catch((error) => {
        console.log(error.response);
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      })

      : <Text/>
  };

  /**
   * renderRow
   *
   * renders each row
   * @param notificationsArray
   * @return {*}
   */
  renderRow = (notificationsArray) => {
    return (
      <View>
        <Row>
          <Image
            styleName="small rounded-corners"
            source={{ uri: 'https://avatars0.githubusercontent.com/u/36486485?s=400&u=4d46599fa96042ef9a1aab19acabd1ca978fc955&v=4' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>{notificationsArray.message}</Subtitle>
            <View style={{ flexDirection: 'row'}}>
              <Caption style={{ alignItems: 'flex-start'}} styleName="sm-gutter-horizontal">{notificationsArray.created_at.substring(0, 10)}</Caption>
              <Caption style={{ alignItems: 'center'}} styleName="sm-gutter-horizontal">{notificationsArray.created_at.substring(11, 16)}</Caption>
            </View>
          </View>
        </Row>
        <Divider styleName="line" />
      </View>
    );
  }


  render () {
    console.log(this.state);
    let { width } = Dimensions.get('window');
    const notificationsArray = this.state.notificationsArray;

    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20, height: '70%', width: width / 1.09}}>
        <ListView
          data={notificationsArray}
          renderRow={this.renderRow}
          onLoadMore={this.onLoadMore}
          renderFooter={this.renderFooter}
          renderHeader={this.renderHeader}
          // autoHideHeader={true}
          onRefresh={this.onRefresh}
          loading={this.state.loading}
        />
      </View>
    );
  }

}

export { NotificationPage };
