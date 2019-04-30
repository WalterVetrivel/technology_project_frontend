import React, {Component} from 'react';
import {List, Button, Icon, Row, Col, Spin} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';

class EventRegistrations extends Component {
	state = {
		registrations: [],
		initLoading: true,
		loading: false,
		first: 5,
		skip: 0
	};

	async componentDidMount() {
		if (localStorage.getItem('isAuth')) {
			const requestQuery = `{
				eventRegistrations(first: ${this.state.first}
					skip: ${this.state.skip}
					orderBy: "createdAt_DESC"
					event: "${this.props.eventId}") {
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
					registrations: results.data.data.eventRegistrations,
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
				eventRegistrations(first: ${this.state.first}
					skip: ${this.state.skip}
					orderBy: "createdAt_DESC"
					event: "${this.props.eventId}") {
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
					results.data.data.eventRegistrations.length > 0
						? [
								...prevState.registrations,
								...results.data.data.eventRegistrations
						  ]
						: [...prevState.registrations];
				return {
					registrations: registrations,
					loading: false,
					more: results.data.data.eventRegistrations.length === prevState.first,
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
				<p>No more.</p>
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
												<Link to={`/event/${item.user.id}`}>
													{item.user.firstName + ' ' + item.user.lastName}
												</Link>
											</h3>
										}
										description={
											<div>
												<p>
													<strong>Registration ID: </strong>
													{item.id}
												</p>
												<p>
													<strong>Total price: </strong>$
													{(item.totalPrice / 100).toFixed(2)}
												</p>
												<p>
													<strong>Guest count: </strong>
													{item.guestCount}
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

export default EventRegistrations;
