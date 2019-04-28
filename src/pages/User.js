import React, {Component} from 'react';
import {Tabs, Avatar, Row, Col, Button, Skeleton, message} from 'antd';
import Navbar from '../components/Layout/Navbar';
import UserAbout from '../components/User/UserAbout';
import UserEvents from '../components/User/UserEvents';
import UserRegistrations from '../components/User/UserRegistrations';
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

	initUserProfile = async () => {
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

	async componentDidMount() {
		await this.initUserProfile();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.match.params.id !== prevState.userId) {
			return {userId: nextProps.match.params.id};
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			await this.initUserProfile();
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
											<Button ghost type="default" icon="plus">
												Follow
											</Button>
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
							</Tabs>
						</main>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

export default User;
