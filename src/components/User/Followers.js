import React, {Component} from 'react';
import {List, Spin, Alert} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Followers extends Component {
	state = {
		followers: [],
		loading: true,
		error: false
	};

	async componentDidMount() {
		const userId = localStorage.getItem('userId');
		const requestQuery = `{
			user(id: "${userId}") {
				followers {
					id
					firstName
					lastName
					state
					country
				}
			}
		}`;
		try {
			const result = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				data: {
					query: requestQuery
				}
			});

			this.setState({
				loading: false,
				followers: result.data.data.user.followers
			});
		} catch (err) {
			console.log(err);
			this.setState({loading: false, error: true});
		}
	}

	render() {
		return this.state.loading ? (
			<Spin spinning={this.state.loading} />
		) : this.state.error ? (
			<Alert message="Something went wrong. Could not fetch followers." />
		) : (
			<List
				dataSource={this.state.followers}
				renderItem={item => (
					<List.Item>
						<List.Item.Meta
							title={
								<Link to={`/user/${item.id}`}>{`${item.firstName} ${
									item.lastName
								}`}</Link>
							}
							description={`${item.state}, ${item.country}`}
						/>
					</List.Item>
				)}
			/>
		);
	}
}

export default Followers;
