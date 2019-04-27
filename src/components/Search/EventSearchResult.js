import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Card, Statistic, Row, Icon, Col, Button} from 'antd';
import RegisterModal from '../Registration/RegisterModal';
import SignupDrawer from '../Auth/SignupDrawer';
import axios from 'axios';

class EventSearchResult extends Component {
	state = {
		isRegistered: false
	};

	async componentDidMount() {
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
			this.setState({
				isRegistered: result.data.data.isRegistered
			});
		}
	}

	render() {
		const event = this.props.event;
		return (
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
							by {event.creator.firstName + ' ' + event.creator.lastName}
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
						this.state.isRegistered ? (
							<RegisterModal event={event} />
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
								value={event.price > 0 ? event.price.toFixed(2) : 'Free'}
							/>
						</Col>
					</Row>
				</div>
			</Card>
		);
	}
}

export default EventSearchResult;
