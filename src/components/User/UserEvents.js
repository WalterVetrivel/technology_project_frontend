import React, {Component} from 'react';
import axios from 'axios';

class UserEvents extends Component {
	state = {
		events: [],
		first: 3,
		skip: 0,
		loading: true
	};

	async componentDidMount() {
		const requestQuery = `{
			events(query: {
				creator: "${this.props.userId}"
			}
			first: ${this.state.first}
			skip: ${this.state.skip}
			orderBy: "dateTime_DESC") {
				id
				title
				dateTime
				category
			}
		}`;
		try {
			const results = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				data: {
					query: requestQuery
				}
			});
			console.log(results.data);
			this.setState({events: results.data.data.events});
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		return <h1>User events</h1>;
	}
}

export default UserEvents;
