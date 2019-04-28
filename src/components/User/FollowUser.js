import React, {Component} from 'react';
import {Button, message} from 'antd';
import axios from 'axios';

class FollowUser extends Component {
	state = {
		isFollowing: false,
		loading: true
	};

	async componentDidMount() {
		if (localStorage.getItem('isAuth')) {
			try {
				const result = await axios({
					method: 'POST',
					url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					data: {
						query: `{
							isFollowing(userId: "${this.props.userId}")
						}`
					}
				});
				this.setState({
					isFollowing: result.data.data.isFollowing,
					loading: false
				});
			} catch (err) {
				console.log(err);
			}
		}
	}

	followAction = async () => {
		let requestQuery = '';
		if (!this.state.isFollowing) {
			requestQuery = `mutation {
				followUser(followingId: "${this.props.userId}")
			}`;
		} else {
			requestQuery = `mutation {
				unfollowUser(followingId: "${this.props.userId}")
			}`;
		}
		try {
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

			result.data.data.followUser
				? message.success(result.data.data.followUser)
				: message.success(result.data.data.unfollowUser);

			this.setState(prevState => {
				return {
					isFollowing: !prevState.isFollowing
				};
			});
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		return this.state.loading ? null : localStorage.getItem('isAuth') ? (
			<Button
				ghost
				onClick={this.followAction}
				icon={this.state.isFollowing ? 'minus-circle' : 'plus-circle'}>
				{this.state.isFollowing ? 'Unfollow' : 'Follow'}
			</Button>
		) : null;
	}
}

export default FollowUser;
