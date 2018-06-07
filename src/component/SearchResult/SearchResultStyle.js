// react-native library
import { Dimensions } from 'react-native';

let width = Dimensions.get("window").width;

const styles = {
  searchResultsWrapper: {
    position: "absolute",
    width: width / 1.18,
    height: 1000,
    backgroundColor: '#fff',
    opacity: 0.9,
    marginLeft: 29
  },
  primaryText: {
    fontWeight: "bold",
    color: "#373737",
  },
  secondaryText: {
    fontStyle: "italic",
    color: "#7D7D7D",
    marginLeft: 20,
  },
  leftContainer: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    borderLeftColor: "#7D7D7D"
  },
  leftIcon: {
    fontSize: 20,
    color: "#7D7D7D",
  },
  distance: {
    fontSize: 12,
  }
};

export default styles;
