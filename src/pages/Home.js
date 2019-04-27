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
		category1Events: [],
		category2Events: [],
		isError: false,
		categories: [
			'Food',
			'Music',
			'Religion',
			'Entertainment',
			'Movie',
			'Charity',
			'Rally',
			'Education',
			'Politics',
			'Social',
			'Job',
			'Sale',
			'Auction',
			'Fundraiser',
			'Other'
		],
		randomCategories: []
	};

	getRandomCategories = () => {
		const length = this.state.categories.length;
		const index1 = Math.floor(Math.random() * length);
		const index2 = (index1 + 1) % length;
		return [this.state.categories[index1], this.state.categories[index2]];
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
				location: "${locationInfo.data.regionName}"
				dateAfter: "${new Date().toISOString()}"
				registrationAfter: "${new Date().toISOString()}"
				notBy: "${localStorage.getItem('userId')}"
			}`;
		}
		return `{
			location: "${locationInfo.data.regionName}"
			dateAfter: "${new Date().toISOString()}"
			registrationAfter: "${new Date().toISOString()}"
		}`;
	};

	getCategoryQueryString = category => {
		if (localStorage.getItem('isAuth')) {
			return `{
				category: "${category}"
				dateAfter: "${new Date().toISOString()}"
				registrationAfter: "${new Date().toISOString()}"
				notBy: "${localStorage.getItem('userId')}"
			}`;
		}
		return `{
			category: "${category}"
			dateAfter: "${new Date().toISOString()}"
			registrationAfter: "${new Date().toISOString()}"
		}`;
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

	getCategoryEvents = async category => {
		const requestQuery = `{
			events(query: ${this.getCategoryQueryString(category)}
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
			console.log('Could not fetch category events');
			this.setState({isError: true});
			return [];
		}
	};

	async componentDidMount() {
		const localEvents = await this.getLocalEvents();
		const randomCategories = this.getRandomCategories();
		const category1Events = await this.getCategoryEvents(randomCategories[0]);
		const category2Events = await this.getCategoryEvents(randomCategories[1]);
		this.setState({
			localEvents,
			category1Events,
			category2Events,
			randomCategories,
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
					{this.renderDivider(`${this.state.randomCategories[0]} Events`)}
					{this.renderEventList(this.state.category1Events)}
					{this.renderDivider(`${this.state.randomCategories[1]} Events`)}
					{this.renderEventList(this.state.category1Events)}
				</main>
			</React.Fragment>
		);
	}
}

export default Home;
