import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Row, Col, Divider} from 'antd';
import SignupDrawer from '../components/SignupDrawer';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import axios from 'axios';
import classes from './styles/Home.module.scss';

class Home extends Component {
	state = {
		isAuth: false,
		localEvents: [],
		upcomingEvents: [],
		isError: false
	};

	async componentDidMount() {
		const token = localStorage.getItem('token');
		if (token) {
			this.setState({isAuth: true});
		}
		const ipInfo = await axios.get('https://ip.seeip.org/json');
		const ip = ipInfo.data.ip;
		const locationInfo = await axios.get(
			`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone`
		);
		const queryString = `{
			events(query: {
					location: "${locationInfo.data.regionName}"
					dateAfter: "${new Date().toISOString()}"
					registrationAfter: "${new Date().toISOString()}"
				}
				orderBy: "dateTime_ASC"
			) {
				id
				title
				description
				dateTime
				price
				address
				city
				postCode
				state
				country
				imageUrl
			}
		}`;
		try {
			const results = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				data: {
					query: queryString
				}
			});
			this.setState({localEvents: results.data.data.events});
		} catch (err) {
			console.log('Could not fetch local events');
			this.setState({isError: true});
		}
	}

	render() {
		return (
			<React.Fragment>
				<header>
					<Navbar {...this.props} />
					<div className={classes.landing}>
						<h1>
							Welcome to Event Booker! Find your favourite event or host your
							own!
						</h1>
						<Row type="flex" gutter={16}>
							<Col>
								<Link to="/search">
									<Button icon="search" size="large">
										Find Events
									</Button>
								</Link>
							</Col>
							<Col>
								{localStorage.getItem('isAuth') ? (
									<Link to="/dashboard">
										<Button type="primary" size="large" icon="form">
											Create Event
										</Button>
									</Link>
								) : (
									<SignupDrawer />
								)}
							</Col>
						</Row>
					</div>
				</header>
				<main className={classes.main}>
					<Divider>
						<h2>Events near you</h2>
					</Divider>
					<Row gutter={16}>
						{this.state.localEvents.map(event => (
							<Col xs={24} sm={12} md={8} key={event.id}>
								<EventCard event={event} />
							</Col>
						))}
					</Row>
				</main>
			</React.Fragment>
		);
	}
}

export default Home;
