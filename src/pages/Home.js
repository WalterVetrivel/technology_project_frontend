import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Row, Col, Divider, Skeleton} from 'antd';
import SignupDrawer from '../components/Auth/SignupDrawer';
import Navbar from '../components/Layout/Navbar';
import EventCard from '../components/Event/EventCard';
import CreateEventModal from '../components/Event/CreateEventModal';
import axios from 'axios';
import classes from './styles/Home.module.scss';

class Home extends Component {
	state = {
		loading: true,
		localEvents: [],
		followingEvents: [],
		isError: false
	};

	getLocationInfo = async () => {
		const ipInfo = await axios.get('https://ip.seeip.org/json');
		const ip = ipInfo.data.ip;
		return await axios.get(
			`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone`
		);
	};

	getLocationQueryString = locationInfo => {
		if (localStorage.getItem('isAuth')) {
			return `{
				location: "${locationInfo.data.country}"
				dateAfter: "${new Date().toISOString()}"
				registrationAfter: "${new Date().toISOString()}"
				notBy: "${localStorage.getItem('userId')}"
			}`;
		}
		return `{
			location: "${locationInfo.data.country}"
			dateAfter: "${new Date().toISOString()}"
			registrationAfter: "${new Date().toISOString()}"
		}`;
	};

	getFollowingEvents = async () => {
		const now = new Date().toISOString();
		try {
			const results = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				data: {
					query: `{
						followingEvents(dateAfter: "${now}" registrationAfter: "${now}" first: 10) ${this.getSelectionSet()}
					}`
				}
			});
			return results.data.data.followingEvents;
		} catch (err) {
			console.log(err);
			this.setState({isError: true});
			return [];
		}
	};

	getSelectionSet = () => {
		return `{
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
			creator {
				id
				firstName
				lastName
			}
		}`;
	};

	getLocalEvents = async () => {
		const locationInfo = await this.getLocationInfo();
		const requestQuery = `{
			events(query: ${this.getLocationQueryString(locationInfo)}
				orderBy: "dateTime_ASC"
				first: 10
			) ${this.getSelectionSet()}
		}`;
		try {
			const results = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				data: {
					query: requestQuery
				}
			});
			return results.data.data.events;
		} catch (err) {
			console.log('Could not fetch local events');
			this.setState({isError: true});
			return [];
		}
	};

	async componentDidMount() {
		const localEvents = await this.getLocalEvents();
		let followingEvents = [];
		if (localStorage.getItem('isAuth')) {
			followingEvents = await this.getFollowingEvents();
		}
		this.setState({
			localEvents,
			followingEvents,
			loading: false
		});
	}

	renderEventList = eventList => (
		<Row gutter={16}>
			{this.state.loading ? (
				<Col xs={24} sm={12} md={8} lg={6}>
					<Skeleton active />
				</Col>
			) : eventList.length > 0 ? (
				eventList.map(event => (
					<Col xs={24} sm={12} md={8} lg={6} key={event.id}>
						<EventCard event={event} />
					</Col>
				))
			) : (
				<Col>
					<p>No events to show.</p>
				</Col>
			)}
		</Row>
	);

	renderDivider = text => (
		<Divider>
			<h2>{text}</h2>
		</Divider>
	);

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
									<CreateEventModal />
								) : (
									<SignupDrawer
										size="large"
										text="Signup/Login"
										{...this.props}
									/>
								)}
							</Col>
						</Row>
					</div>
				</header>
				<main className={classes.main}>
					{this.renderDivider('Events near you')}
					{this.renderEventList(this.state.localEvents)}
					{localStorage.getItem('isAuth') ? (
						<React.Fragment>
							{this.renderDivider('Events by people you are following')}
							{this.renderEventList(this.state.followingEvents)}
						</React.Fragment>
					) : null}
				</main>
			</React.Fragment>
		);
	}
}

export default Home;
