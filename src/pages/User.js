import React, {Component} from 'react';
import {Tabs, Avatar, Row, Col, Skeleton, message} from 'antd';
import Navbar from '../components/Layout/Navbar';
import UserAbout from '../components/User/UserAbout';
import UserEvents from '../components/User/UserEvents';
import UserRegistrations from '../components/User/UserRegistrations';
import FollowUser from '../components/User/FollowUser';
import Followers from '../components/User/Followers';
import Following from '../components/User/Following';
import axios from 'axios';
import classes from './styles/User.module.scss';

class User extends Component {
	state = {
		isCurrentUser: false,
		profileInfo: null,
		createdEvents: [],
		registrations: [],
		followers: [],
		following: [],
		invitations: [],
		loading: true,
		userId: ''
	};

	async componentDidMount() {
		const userId = this.props.match.params.id;
		let isCurrentUser = false;
		if (
			localStorage.getItem('isAuth') &&
			localStorage.getItem('userId') === userId
		) {
			isCurrentUser = true;
		}
		const profileQuery = `{
			user(id: "${userId}") {
				firstName
				lastName
				city
				country
			}
		}`;
		try {
			const profileResult = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				data: {
					query: profileQuery
				}
			});
			this.setState({
				profileInfo: profileResult.data.data.user,
				loading: false,
				isCurrentUser,
				userId
			});
		} catch (err) {
			message.error('Something went wrong');
		}
	}

	render() {
		return (
			<React.Fragment>
				<Navbar {...this.props} />
				{this.state.loading ? (
					<Skeleton active />
				) : (
					<React.Fragment>
						<Col className={classes.profileBanner}>
							<Row type="flex" gutter={16} align="middle" justify="center">
								<Col>
									<div className={classes.avatar}>
										<Avatar size={80} icon="user" />
										{!this.state.isCurrentUser &&
										localStorage.getItem('isAuth') ? (
											<FollowUser userId={this.state.userId} />
										) : null}
									</div>
								</Col>
								<Col>
									<h1>{`${this.state.profileInfo.firstName} ${
										this.state.profileInfo.lastName
									}`}</h1>
									<h3>{`${this.state.profileInfo.city}, ${
										this.state.profileInfo.country
									}`}</h3>
								</Col>
							</Row>
						</Col>
						<main className={classes.main}>
							<Tabs defaultActiveKey="1" animated>
								<Tabs.TabPane key="1" tab="About">
									<UserAbout
										isCurrentUser={this.state.isCurrentUser}
										userId={this.props.match.params.id}
									/>
								</Tabs.TabPane>
								<Tabs.TabPane key="2" tab="Hosted events">
									<UserEvents
										isCurrentUser={this.state.isCurrentUser}
										userId={this.props.match.params.id}
									/>
								</Tabs.TabPane>
								{this.state.isCurrentUser ? (
									<Tabs.TabPane key="3" tab="Registered Events">
										<UserRegistrations
											isCurrentUser={this.state.isCurrentUser}
											userId={this.props.match.params.id}
										/>
									</Tabs.TabPane>
								) : null}
								{this.state.isCurrentUser ? (
									<Tabs.TabPane key="4" tab="Following">
										<Following />
									</Tabs.TabPane>
								) : null}
								{this.state.isCurrentUser ? (
									<Tabs.TabPane key="5" tab="Followers">
										<Followers />
									</Tabs.TabPane>
								) : null}
							</Tabs>
						</main>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
export default User;
