import React, {Component} from 'react';
import axios from 'axios';

class UserRegistrations extends Component {
	state = {
		registrations: [],
		loading: true,
		first: 3,
		skip: 0
	};

	async componentDidMount() {
		if (localStorage.getItem('isAuth')) {
			const requestQuery = `{
				userRegistrations(first: ${this.state.first}
					skip: ${this.state.skip}
					orderBy: "createdAt_DESC") {
						id
						user {
							id
							firstName
							lastName
						}
						event {
							id
							title
							dateTime
						}
						guestCount
						totalPrice
					}
			}`;
		}
	}

	render() {
		return <h1>User registrations</h1>;
	}
}

export default UserRegistrations;
