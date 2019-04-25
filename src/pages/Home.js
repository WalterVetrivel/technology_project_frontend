import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SignupDrawer from '../components/SignupDrawer';
import Navbar from '../components/Navbar';
import classes from './styles/Home.module.scss';

class Home extends Component {
	state = {
		isAuth: false,
		localEvents: [],
		upcomingEvents: []
	};

	componentDidMount() {
		console.log(this.props);
		const token = localStorage.getItem('token');
		if (token) {
			this.setState({isAuth: true});
		}
	}

	render() {
		return (
			<header>
				<Navbar {...this.props} isAuth={this.state.isAuth} />
				<div className={classes.landing}>
					<h1>
						Welcome to Event Booker! Find your favourite event or host your own!
					</h1>
					{<SignupDrawer />}
				</div>
			</header>
		);
	}
}

export default Home;
