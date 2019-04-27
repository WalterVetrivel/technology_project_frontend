import React, {Component} from 'react';
import {Card, Row, Typography, Icon, Button} from 'antd';
import {Link} from 'react-router-dom';
import RegisterModal from '../Registration/RegisterModal';
import SignupDrawer from '../Auth/SignupDrawer';
import axios from 'axios';

const {Paragraph} = Typography;

class EventCard extends Component {
	state = {
		isRegistered: false,
		loading: true
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
				loading: false,
				isRegistered: result.data.data.isRegistered
			});
		}
	}

	render() {
		const event = this.props.event;
		return (
			<Card
				hoverable
				cover={
					<img
						alt={event.title}
						src={
							event.imageUrl
								? event.imageUrl
								: 'https://via.placeholder.com/100'
						}
					/>
				}
				actions={[
					<Link to={`/event/${event.id}`}>View Event</Link>,
					localStorage.getItem('isAuth') ? (
						this.state.isRegistered ? (
							<RegisterModal event={event} />
						) : (
							<Button>Registered!</Button>
						)
					) : (
						<SignupDrawer size="small" text="Login" />
					)
				]}>
				<Card.Meta
					title={
						<Row type="flex" justify="space-between">
							<h3>{event.title}</h3>
							<strong>
								{event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
							</strong>
						</Row>
					}
					description={
						<Paragraph>
							by{' '}
							<strong>
								{event.creator.firstName + ' ' + event.creator.lastName}
							</strong>
						</Paragraph>
					}
				/>
				<p>
					<strong>
						<Icon type="calendar" />
						&nbsp;
						{new Date(event.dateTime).toLocaleString()}
					</strong>
				</p>
				<p>
					<b>
						<Icon type="home" />
						&nbsp;
					</b>
					{`${event.address}, ${event.city}, ${event.postCode}, ${event.state}`}
				</p>
			</Card>
		);
	}
}

export default EventCard;
