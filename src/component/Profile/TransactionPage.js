// react libraries
import React, { Component } from 'react';

// react-native libraries
import { Dimensions, TouchableOpacity, View} from 'react-native';

// third-party libraries
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Title, Row } from '@shoutem/ui';
import { Button, Icon } from 'react-native-elements'
import Toast from "react-native-simple-toast";

class TransactionPage extends Component {
  state = {
    isDateTimePickerVisibleFrom: false,
    isDateTimePickerVisibleTo: false,
    dateFrom: '',
    dateTo: ''
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.setState({
      userEmail: this.props.userEmail,
    })
  }

  /**_showDateTimePickerFrom
   *
   * shows Date picker box
   * @return {void|*}
   * @private
   */
  _showDateTimePickerFrom = () => this.setState({ isDateTimePickerVisibleFrom: true });

  /**_showDateTimePickerTo
   *
   * shows Date picker box
   * @return {void|*}
   * @private
   */
  _showDateTimePickerTo = () => this.setState({ isDateTimePickerVisibleTo: true });

  /**
   * _hideDateTimePickerFrom
   *
   * hides date picker
   * @return {void|*}
   * @private
   */
  _hideDateTimePickerFrom = () => this.setState({ isDateTimePickerVisibleFrom: false });

  /**
   * _hideDateTimePickerTo
   *
   * hides date picker
   * @return {void|*}
   * @private
   */
  _hideDateTimePickerTo = () => this.setState({ isDateTimePickerVisibleTo: false });

  /**
   * _handleDatePickedFrom
   *
   * handles date picked from the date picker
   * @param date
   * @private
   */
  _handleDatePickedFrom = (date) => {
    this.setState({ dateFrom: date });
    this._hideDateTimePickerFrom();
  };

  /**
   * _handleDatePickedTo
   *
   * handles date picked from the date picker
   * @param date
   * @private
   */
  _handleDatePickedTo = (date) => {
    this.setState({ dateTo: date });
    this._hideDateTimePickerTo();
  };

  /**
   * submitRequest
   *
   * Submits request to server
   */
  submitRequest = () => {
    Toast.showWithGravity(`${this.state.dateFrom} ${this.state.userEmail} ${this.state.dateTo}`, Toast.LONG, Toast.TOP);
  };

  render () {
    console.log(this.state);
    console.log(typeof this.state.dateFrom);
    let { height, width } = Dimensions.get('window');

    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', width: width, marginTop: height / 20 }}>
        <View style={{ width: width / 2 }}>
          <TouchableOpacity onPress={this._showDateTimePickerFrom} >
            <Row styleName="medium">
              <Icon
                name="calendar"
                type="font-awesome"
                color={ '#333' }
              />
              <Title style={{ textAlign: 'center'}}>From</Title>
              <Icon
                name="ios-arrow-forward"
                type="ionicon"
                color={ '#333' }
              />
            </Row>
          </TouchableOpacity>
        </View>
        <View style={{ width: width / 2, marginBottom: height / 15 }}>
          <TouchableOpacity onPress={this._showDateTimePickerTo}>
            <Row styleName="medium">
              <Icon
                name="calendar"
                type="font-awesome"
                color={ '#333' }
              />
              <Title style={{ textAlign: 'center'}}>To</Title>
              <Icon
                name="ios-arrow-forward"
                type="ionicon"
                color={ '#333' }
              />
            </Row>
          </TouchableOpacity>
        </View>
        <View style={{  backgroundColor: '#fff', width: width , height: '25%',}}>
          <TouchableOpacity style={{ alignItems: 'center'}}>
            <Button
              title='SEND EMAIL'
              buttonStyle={{
                backgroundColor: "#333",
                width: 200,
                height: 45,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
              }}
              onPress={this.submitRequest}
              containerStyle={{ marginTop: 20 }}
            />
          </TouchableOpacity>
        </View>
        <DateTimePicker
          titleIOS='Pick a date'
          isVisible={this.state.isDateTimePickerVisibleFrom}
          onConfirm={this._handleDatePickedFrom}
          onCancel={this._hideDateTimePickerFrom}
        />
        <DateTimePicker
          titleIOS='Pick a date'
          isVisible={this.state.isDateTimePickerVisibleTo}
          onConfirm={this._handleDatePickedTo}
          onCancel={this._hideDateTimePickerTo}
        />
      </View>
    );
  }

}

export { TransactionPage };
