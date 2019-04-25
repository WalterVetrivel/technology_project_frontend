import React, {Component} from 'react';
import axios from 'axios';

class Event extends Component {
	state = {
		displayedEvent: null
	};

	async componentDidMount() {
		console.log(this.props);
		const eventId = this.props.match.params.id;
		console.log(eventId);
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
		console.log(result.data.data.event);
		this.setState({displayedEvent: result.data.data.event});
	}

	render() {
		return <h1>This is the event page</h1>;
	}
}

export default Event;
