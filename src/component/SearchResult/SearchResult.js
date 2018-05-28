// react library
import React, { Component } from 'react';

// react-native libraries
import { TouchableOpacity } from 'react-native';

// third-part libraries
import { View, List, ListItem, Icon, Left, Text, Body } from 'native-base';

import styles from './SearchResultStyle'

// component
import { StatusBarComponent } from "../../common";

const SearchResult =  ({ predictions, onPress }) => {
  return (
    <View style={styles.searchResultsWrapper}>
      <List
        keyboardShouldPersistTaps='handled'
        dataArray={predictions}
        renderRow={(item) =>(
          <View >
            <ListItem button avatar>
            {/*<ListItem onPress={() => onPress(item)} button avatar>*/}
              <Left style={styles.leftContainer}>
                <Icon Icon style={styles.leftIcon} name="location-on" type="MaterialIcons" />
              </Left>
              <Body>
              <TouchableOpacity onPress={() => onPress(item)}>
                <Text style={styles.primaryText}>{item.primaryText}</Text>
                <Text style={styles.secondaryText}>{item.primaryText}</Text>
              </TouchableOpacity>
              </Body>
            </ListItem>
          </View>
        )}
      />
    </View>
  );
};

export { SearchResult }


// {/*<List>*/}
// {/*<ListItem button avatar>*/}
// {/*<Left style={styles.leftContainer}>*/}
// {/*<Icon style={styles.leftIcon} name="location-on" type="MaterialIcons"/>*/}
// {/*</Left>*/}
// {/*<Text>List item 1</Text>*/}
// {/*</ListItem>*/}
// {/*</List>*/}
