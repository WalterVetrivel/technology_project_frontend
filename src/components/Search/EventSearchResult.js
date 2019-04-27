import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Card, Statistic, Row, Icon, Col, Button, Skeleton} from 'antd';
import RegisterModal from '../Registration/RegisterModal';
import SignupDrawer from '../Auth/SignupDrawer';
import axios from 'axios';

class EventSearchResult extends Component {
	state = {
		isRegistered: false,
		isCreator: false,
		loading: true
	};

	async componentDidMount() {
		let isRegistered = false;
		if (localStorage.getItem('isAuth')) {
			const requestQuery = `{
				isRegistered(eventId: "${this.props.event.id}")
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
			isRegistered = result.data.data.isRegistered;
		}
		this.setState({
			isRegistered,
			isCreator: this.props.event.creator.id === localStorage.getItem('userId'),
			loading: false
		});
	}

	render() {
		const event = this.props.event;
		return this.state.loading ? (
			<Skeleton active />
		) : (
			<Card
				style={{width: '100%', backgroundColor: '#fff'}}
				title={
					<Row
						type="flex"
						justify="space-between"
						align="middle"
						style={{width: '100%'}}>
						<h3>
							<Link to={`/event/${event.id}`}>{event.title}</Link>
						</h3>
						<small>
							{' '}
							by{' '}
							<Link to={`/user/${event.creator.id}`}>
								{event.creator.firstName + ' ' + event.creator.lastName}
							</Link>
						</small>
					</Row>
				}
				bordered={false}
				actions={[
					<Link to={`/event/${event.id}`}>
						<Icon type="eye" />
						&nbsp; View
					</Link>,
					localStorage.getItem('isAuth') ? (
						!this.state.isRegistered && !this.state.isCreator ? (
							<RegisterModal event={event} />
						) : this.state.isCreator ? (
							<strong>Your event</strong>
						) : (
							<Button>Registered!</Button>
						)
					) : (
						<SignupDrawer size="default" text="Login" />
					)
				]}>
				<div>
					<Row type="flex" justify="center" style={{width: '100%'}}>
						<Col xs={24} md={8}>
							<p>
								<Icon type="calendar" />
								&nbsp;
								{new Date(event.dateTime).toLocaleDateString()}
							</p>
							<p>
								<Icon type="clock-circle" />
								&nbsp;
								{new Date(event.dateTime).toLocaleTimeString()}
							</p>
						</Col>
						<Col xs={24} md={8}>
							<p>
								<Icon type="global" />
								&nbsp;
								{`${event.address}, `}
								<br />
								{`${event.city}, ${event.postCode},`}
								<br />
								{`${event.state}, ${event.country}`}
							</p>
						</Col>
						<Col xs={24} md={8} style={{textAlign: 'center'}}>
							<Statistic
								value={event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
							/>
						</Col>
					</Row>
				</div>
			</Card>
		);
	}
}

export default EventSearchResult;
