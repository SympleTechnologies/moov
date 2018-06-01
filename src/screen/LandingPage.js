// react libraries
import React from 'react';

// react-native libraries
import {
	Animated,
	TouchableOpacity,
	ImageBackground,
	Image,
	AsyncStorage
} from 'react-native';
import * as Animatable from 'react-native-animatable';

// third-party libraries
import { Container, Content } from 'native-base';

// common
import { StatusBarComponent } from "../common";

class LandingPage extends React.Component {
	/**
	 * constructor
	 */
	constructor () {
		super();
		this.springValue = new Animated.Value(0.3);
	}
	
	/**
	 * componentDidMount
	 *
	 * React life-cycle method
	 * @return {void}
	 */
	componentDidMount() {
		const { navigate } = this.props.navigation;
		this.spring();
		// AsyncStorage.getItem("user").then((value) => {
		//   if(value !== null) {
		//     navigate('MoovPages');
		//   }
		// }).done();
	}
	
	/**
	 * spring
	 *
	 * Animates app icon
	 * @returns {void}
	 */
	spring = () => {
		this.springValue.setValue(0.1);
		Animated.spring(
			this.springValue,
			{
				toValue: 1,
				friction: 1
			}
		).start()
	};
	
	/**
	 * appNavigation
	 *
	 * Navigates user to SignIn page
	 * @return {void}
	 */
	appNavigation = () => {
		const { navigate } = this.props.navigation;
		navigate('SignInPage');
	};
	
	render() {
		return (
			<Container>
				<StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
				<ImageBackground
					style={{
						height: '100%',
						width: '100%',
						flex: 1
					}}
					source={require('../../assets/moovBG2.png')}
				>
					<Content contentContainerStyle={{ alignItems: 'center'}}>
						<TouchableOpacity onPress={this.appNavigation}>
							<Animated.Image
								style={{
									alignItems: 'center',
									height: 110,
									width: 110,
									marginTop: 50,
									transform: [{scale: this.springValue}],
									borderRadius: 10
								}}
								source={require('../../assets/appLogo.png')}
							/>
						</TouchableOpacity>
					</Content>
					<Content/>
					<TouchableOpacity onPress={this.appNavigation}>
						<Image
							styleName="medium"
							style={{
								marginLeft: 40,
								height: 90,
								width:  270,
							}}
							source={require('../../assets/moov-car-side.png')}
						/>
					</TouchableOpacity>
				</ImageBackground>
			</Container>
		);
	}
}

export { LandingPage };
