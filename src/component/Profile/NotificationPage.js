// react libraries
import React, { Component } from 'react';

// react-native libraries
import { Dimensions, TouchableOpacity, View, Text, ScrollView } from 'react-native';

// third-party libraries
import { Title, Row, ListView, ImageBackground, Caption, Tile, Subtitle, Divider } from '@shoutem/ui';
import { Button, Icon } from 'react-native-elements'
import Toast from "react-native-simple-toast";
import * as axios from "axios/index";

class NotificationPage extends Component {
  constructor(props) {
    super(props);
    // this.renderRow = this.renderRow.bind(this);
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
          loading: false
        }, () => this.stopSpinner())
      })
      .catch((error) => {
        console.log(error.response);
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });
  };

  stopSpinner = () => {
    console.log('called spinnrt');
    if(this.state.loading === false) {
      return false
    }
  };

  /**
   * renderHeader
   *
   * renders Header
   * @return {*}
   */
  renderHeader = () => {
    return (
      <View>
        <Caption style={{ textAlign: 'center'}}>Drag</Caption>
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
    return this.state.notification.next_url !== null

    ?
      <View>
        <Caption style={{ textAlign: 'center'}}>Loading...</Caption>
      </View>
    : <View>
        <Caption style={{ textAlign: 'center'}}>End</Caption>
      </View>
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
        <Tile>
          <Subtitle styleName="md-gutter-bottom">{notificationsArray.message}</Subtitle>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Caption styleName="sm-gutter-horizontal">{notificationsArray.created_at.substring(0, 10)}</Caption>
            <Caption styleName="sm-gutter-horizontal">{notificationsArray.created_at.substring(11, 16)}</Caption>
          </View>
        </Tile>
        <Divider styleName="line" />
      </View>
    );
  }


  render () {
    console.log(this.state);
    let { height, width } = Dimensions.get('window');
    const notificationsArray = this.state.notificationsArray;

    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20, width: width, height: '60%'}}>
        <ListView
          data={notificationsArray}
          renderRow={this.renderRow}
          onLoadMore={this.onLoadMore}
          renderFooter={this.renderFooter}
          renderHeader={this.renderHeader}
          autoHideHeader={true}
          onRefresh={this.onRefresh}
          loading={this.state.loading}
        />
      </View>
    );
  }

}

export { NotificationPage };
