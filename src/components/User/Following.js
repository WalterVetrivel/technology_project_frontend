import React, {Component} from 'react';
import {List, Spin, Alert} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Following extends Component {
	state = {
		following: [],
		loading: true,
		error: false
	};

	async componentDidMount() {
		const userId = localStorage.getItem('userId');
		const requestQuery = `{
			user(id: "${userId}") {
				following {
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
				following: result.data.data.user.following
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
			<Alert message="Something went wrong. Could not fetch following." />
		) : (
			<List
				dataSource={this.state.following}
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

export default Following;
