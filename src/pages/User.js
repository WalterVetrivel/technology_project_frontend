import React, {Component} from 'react';
import {Tabs, Avatar, Row, Col, Button, Skeleton, message} from 'antd';
import Navbar from '../components/Navbar';
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
		loading: true
	};

	async componentDidMount() {
		const userId = this.props.match.params.id;
		if (localStorage.getItem('userId') === userId) {
			this.setState({isCurrentUser: true});
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
				loading: false
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
										{this.state.isCurrentUser ? (
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
									<p>About</p>
								</Tabs.TabPane>
								<Tabs.TabPane key="2" tab="Hosted events">
									<p>Hosted events</p>
								</Tabs.TabPane>
								{this.state.isCurrentUser ? (
									<Tabs.TabPane key="3" tab="Registered Events">
										<p>Registered Events</p>
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
