import React, {Component} from 'react';
import {List, Form, Button, Input, Row, Skeleton, message} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';

class EventDiscussion extends Component {
	state = {
		initLoading: true,
		loading: false,
		more: true,
		posts: [],
		currentPost: '',
		queryString: '',
		skip: 0,
		first: 5,
		selectionSet: `{
			id
			author {
				id
				firstName
				lastName
			}
			content
		}`
	};

	async componentDidMount() {
		const queryString = `eventId: ${this.props.eventId} first: ${
			this.state.first
		} skip: ${this.state.skip}`;
		this.setState({queryString});
		try {
			const results = axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				data: {
					query: `{
						eventPosts(${queryString}) ${this.state.selectionSet}
					}`
				}
			});
			const skip = this.state.skip + this.state.first;
			this.setState({
				posts: results.data.data.eventPosts,
				initLoading: false,
				skip
			});
		} catch (err) {
			console.log(err);
		}
	}

	onLoadMore = async () => {
		try {
			const results = axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				data: {
					query: `{
						eventPosts(${this.state.queryString}) ${this.state.selectionSet}
					}`
				}
			});
			const skip = this.state.skip + this.state.first;
			this.setState(prevState => {
				const posts =
					results.data.data.eventPosts.length > 0
						? [...prevState.posts, ...results.data.data.eventPosts]
						: [...prevState.posts];
				return {
					posts,
					loading: false,
					more: results.data.data.events.length === prevState.first,
					skip
				};
			});
		} catch (err) {
			console.log(err);
		}
	};

	onChangeCurrentPost = e => {
		this.setState({currentPost: e.target.value});
	};

	onSubmit = async e => {
		e.preventDefault();
		if (this.state.currentPost.trim() !== '') {
			try {
				const result = axios({
					method: 'POST',
					url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					},
					data: {
						query: `mutation {
							createPost(data: {
								event: ${this.props.eventId}
								content: ${this.state.currentPost}
							}) ${this.state.selectionSet}
						}`
					}
				});
				this.setState(prevState => {
					const posts = [...prevState.posts, result.data.data.post];
					return {
						posts,
						currentPost: ''
					};
				});
				message.success('Post added!');
			} catch (err) {
				console.log(err);
			}
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
			<React.Fragment>
				<h2>Posts</h2>
				<Row type="flex" justify="center">
					<Col md={16}>
						{this.state.posts.length > 0 ? (
							<List
								loadMore={loadMore}
								dataSource={this.state.posts}
								renderItem={item => (
									<List.Item>
										<List.Item.Meta
											title={item.content}
											description={
												<Link to={`/user/${item.author.id}`}>{`${
													item.author.firstName
												} ${item.author.lastName}`}</Link>
											}
										/>
									</List.Item>
								)}
							/>
						) : this.state.initLoading ? (
							<Skeleton active />
						) : (
							<p>No posts to show.</p>
						)}
						{localStorage.getItem('isAuth') ? (
							<Form onSubmit={this.onSubmit}>
								<Form.Item label="New post">
									<Input.TextArea
										placeholder="Your post here"
										rows={5}
										style={{resize: 'none'}}
										value={this.state.currentPost}
										onChange={this.onChangeCurrentPost}
										required
									/>
								</Form.Item>
								<Form.Item>
									<Button
										htmlType="submit"
										type="primary"
										size="large"
										icon="check-circle"
										disabled={this.state.currentPost.trim() !== ''}>
										Enter post
									</Button>
								</Form.Item>
							</Form>
						) : null}
					</Col>
				</Row>
			</React.Fragment>
		);
	}
}

export default EventDiscussion;
