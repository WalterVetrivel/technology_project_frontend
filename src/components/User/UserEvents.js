import React, {Component} from 'react';
import {List, Button, Icon, Tag, Row, Col, Spin} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
import classes from '../styles/User.module.scss';

class UserEvents extends Component {
	state = {
		events: [],
		first: 2,
		skip: 0,
		loading: false,
		initLoading: true,
		more: true
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
			const skip = this.state.skip + 2;
			this.setState({
				events: results.data.data.events,
				initLoading: false,
				skip
			});
		} catch (err) {
			console.log(err);
		}
	}

	onLoadMore = async () => {
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
			const skip = this.state.skip + 2;
			this.setState(prevState => {
				const events =
					results.data.data.events.length > 0
						? [...prevState.events, ...results.data.data.events]
						: [...prevState.events];
				return {
					events: events,
					loading: false,
					more: results.data.data.events.length === prevState.first,
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
					<h1>User events</h1>
					<Spin spinning={this.state.initLoading}>
						<List
							loadMore={loadMore}
							dataSource={this.state.events}
							renderItem={item => (
								<List.Item>
									<List.Item.Meta
										title={
											<h3>
												<Link to={`/event/${item.id}`}>{item.title}</Link>
											</h3>
										}
										description={
											<div>
												<Icon type="calendar" />
												&nbsp;{new Date(item.dateTime).toLocaleDateString()}
												<p>
													<Tag color="#2db7f5">{item.category}</Tag>
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

export default UserEvents;
