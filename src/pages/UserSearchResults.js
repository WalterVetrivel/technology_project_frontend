import React, {Component} from 'react';
import {List, Button, Row, Col} from 'antd';
import {Link} from 'react-router-dom';
import UserSearchForm from '../components/Search/UserSearchForm';
import axios from 'axios';
import classes from './styles/Search.module.scss';

class UserSearchResults extends Component {
	state = {
		name: '',
		location: '',
		searchResults: [],
		initLoading: true,
		loading: false,
		first: 3,
		skip: 0,
		queryString: '',
		more: true
	};

	async componentDidMount() {
		const requestQuery = `{
			users(first: ${this.state.first}) 
			{
				id
				firstName
				lastName
				state
				country
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
			const skip = this.state.skip + this.state.first;
			this.setState({
				searchResults: results.data.data.users,
				loading: false,
				skip
			});
		} catch (err) {
			console.log(err);
		}
	}

	onNameChange = e => {
		this.setState({name: e.target.value});
	};

	onLocationChange = e => {
		this.setState({location: e.target.value});
	};

	onSubmit = async e => {
		e.preventDefault();
		this.setState({skip: 0, loading: true, initLoading: false, more: true});
		const name = this.state.name;
		const location = this.state.location;
		let queryString = '{\n';
		if (name.trim() !== '') {
			queryString += `name: "${name}"\n`;
		}
		if (location.trim() !== '') {
			queryString += `location: "${location}"\n`;
		}
		queryString += `}`;
		this.setState({queryString});
		const requestQuery = `{
			users(query: ${queryString}
				first: ${this.state.first}
				skip: 0) {
					id
					firstName
					lastName
					state
					country
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
			const skip = this.state.skip + this.state.first;
			this.setState({
				searchResults: results.data.data.users,
				loading: false,
				skip
			});
		} catch (err) {
			console.log(err);
		}
	};

	onLoadMore = async () => {
		const requestQuery = `{
			users(query: ${this.state.queryString}
				first: ${this.state.first}
				skip: ${this.state.skip}) {
					id
					firstName
					lastName
					state
					country
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
			const skip = this.state.skip + this.state.first;
			this.setState(prevState => {
				const searchResults =
					results.data.data.users.length > 0
						? [...prevState.searchResults, ...results.data.data.users]
						: [...prevState.searchResults];
				return {
					searchResults: searchResults,
					loading: false,
					more: results.data.data.users.length === prevState.first,
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
			<React.Fragment>
				<div className={classes.searchForm}>
					<UserSearchForm
						name={this.state.name}
						onNameChange={this.onNameChange.bind(this)}
						location={this.state.location}
						onLocationChange={this.onLocationChange.bind(this)}
						onSubmit={this.onSubmit.bind(this)}
					/>
				</div>
				<main className={classes.main}>
					<Row type="flex" justify="center">
						<Col md={12}>
							<List
								loadMore={loadMore}
								dataSource={this.state.searchResults}
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
						</Col>
					</Row>
				</main>
			</React.Fragment>
		);
	}
}

export default UserSearchResults;
