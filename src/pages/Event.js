import React, {Component} from 'react';
import Navbar from '../components/Layout/Navbar';
import axios from 'axios';
import {Row, Col, Tabs, Skeleton, Statistic, Button} from 'antd';
import EventDetails from '../components/Event/EventDetails';
import RegisterModal from '../components/Registration/RegisterModal';
import SignupDrawer from '../components/Auth/SignupDrawer';
import classes from './styles/Event.module.scss';

class Event extends Component {
	state = {
		loading: true,
		event: null,
		location: {lat: 0, lng: 0},
		isRegistered: false
	};

	async componentDidMount() {
		const eventId = this.props.match.params.id;
		const requestQuery = `{
			event(id: "${eventId}") {
				id
				title
				description
				address
				city
				postCode
				state
				country
				price
				registrationDeadline
				category
				dateTime
				imageUrl
				creator {
					id
					firstName
					lastName
				}
			}
		}`;
		const result = await axios({
			method: 'POST',
			url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
			data: {
				query: requestQuery
			}
		});
		const event = result.data.data.event;
		const addressString = `${event.address},${event.city},${event.postCode},${
			event.state
		},${event.country}`;
		const geocodeInfo = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${addressString.trim()}&key=${
				process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY
			}`
		);
		const location = geocodeInfo.data.results[0].geometry.location;
		if (localStorage.getItem('isAuth')) {
			const requestQuery = `{
				isRegistered(eventId: "${eventId}")
			}`;
			const result = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				data: {
					query: requestQuery
				}
			});
			console.log(result.data.data.isRegistered);
			this.setState({
				isRegistered: result.data.data.isRegistered
			});
		}
		this.setState({event, location, loading: false});
	}

	render() {
		return (
			<React.Fragment>
				<Navbar {...this.props} />
				<main className={classes.main}>
					<Row type="flex" justify="center">
						<Col xs={24} md={20} lg={18}>
							{!this.state.loading ? (
								<React.Fragment>
									<div>
										<img
											alt={this.state.event.title}
											src={
												this.state.event.imageUrl
													? `${this.state.event.imageUrl}`
													: 'https://via.placeholder.com/150'
											}
										/>
									</div>
									<div className={classes.eventHeader}>
										<Row type="flex" justify="space-between" align="middle">
											<h2>{this.state.event.title}</h2>
											<div>
												<Statistic
													value={
														this.state.event.price > 0
															? `$${this.state.event.price.toFixed(2)}`
															: 'Free'
													}
													precision={2}
												/>
												{localStorage.getItem('isAuth') ? (
													this.state.isRegistered ? (
														<RegisterModal event={this.state.event} />
													) : (
														<Button>Registered!</Button>
													)
												) : (
													<SignupDrawer size="large" text="Login" />
												)}
											</div>
										</Row>
									</div>
									<Tabs defaultActiveKey="1">
										<Tabs.TabPane tab="Details" key="1">
											<EventDetails
												event={this.state.event}
												location={this.state.location}
											/>
										</Tabs.TabPane>
										<Tabs.TabPane tab="Discussion" key="2">
											<p>No posts yet.</p>
										</Tabs.TabPane>
									</Tabs>
								</React.Fragment>
							) : (
								<Skeleton active />
							)}
						</Col>
					</Row>
				</main>
			</React.Fragment>
		);
	}
}

export default Event;
