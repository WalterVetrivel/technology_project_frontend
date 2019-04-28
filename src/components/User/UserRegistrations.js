import React, {Component} from 'react';
import {List, Button, Icon, Row, Col, Spin} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
import classes from '../styles/User.module.scss';

class UserRegistrations extends Component {
	state = {
		registrations: [],
		loading: false,
		initLoading: true,
		first: 3,
		skip: 0,
		more: true
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
			try {
				const results = await axios({
					method: 'POST',
					url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					data: {
						query: requestQuery
					}
				});
				const skip = this.state.skip + 2;
				this.setState({
					registrations: results.data.data.userRegistrations,
					initLoading: false,
					skip
				});
			} catch (err) {
				console.log(err);
			}
		}
	}

	onLoadMore = async () => {
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
		try {
			const results = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				data: {
					query: requestQuery
				}
			});
			const skip = this.state.skip + 2;
			this.setState(prevState => {
				const registrations =
					results.data.data.userRegistrations.length > 0
						? [
								...prevState.registrations,
								...results.data.data.userRegistrations
						  ]
						: [...prevState.registrations];
				return {
					registrations: registrations,
					loading: false,
					more: results.data.data.userRegistrations.length === prevState.first,
					skip
				};
			});
		} catch (err) {
			console.log(err);
		}
	};

	render() {
		const loadMore =
			!this.state.initLoading && !this.state.loading && this.state.more ? (
				<div
					style={{
						textAlign: 'center',
						marginTop: 12,
						height: 32,
						lineHeight: '32px'
					}}>
					<Button onClick={this.onLoadMore}>Load more</Button>
				</div>
			) : !this.state.more ? (
				<p className={classes.center}>No more.</p>
			) : null;

		return (
			<Row type="flex" justify="center">
				<Col sm={20}>
					<h1>User registrations</h1>
					<Spin spinning={this.state.initLoading}>
						<List
							loadMore={loadMore}
							dataSource={this.state.registrations}
							renderItem={item => (
								<List.Item>
									<List.Item.Meta
										title={
											<h3>
												<Link to={`/event/${item.event.id}`}>
													{item.event.title}
												</Link>
											</h3>
										}
										description={
											<div>
												<Icon type="calendar" />
												&nbsp;
												{new Date(item.event.dateTime).toLocaleDateString()}
												<p>
													<strong>You paid: </strong>${item.totalPrice} for{' '}
													{item.guestCount} tickets.
												</p>
											</div>
										}
									/>
								</List.Item>
							)}
						/>
					</Spin>
				</Col>
			</Row>
		);
	}
}

export default UserRegistrations;
