import React, {Component} from 'react';
import {List, Button, Row, Col} from 'antd';
import SearchForm from '../components/SearchForm';
import Navbar from '../components/Navbar';
import EventSearchResult from '../components/EventSearchResult';
import axios from 'axios';
import classes from './styles/Search.module.scss';

class SearchResults extends Component {
	state = {
		query: '',
		location: '',
		categories: [
			'All',
			'Food',
			'Music',
			'Religion',
			'Entertainment',
			'Movie',
			'Charity',
			'Rally',
			'Education',
			'Politics',
			'Social',
			'Job',
			'Sale',
			'Auction',
			'Fundraiser',
			'Other'
		],
		selectedCategory: 'All',
		costTypes: ['Free', 'Paid', 'All'],
		selectedCostType: 'All',
		searchResults: [],
		initLoading: true,
		loading: false,
		first: 1,
		skip: 0,
		queryString: '',
		more: true
	};

	componentDidMount() {
		console.log(this.props);
	}

	onQueryChange = e => {
		this.setState({query: e.target.value});
	};

	onLocationChange = e => {
		this.setState({location: e.target.value});
	};

	onCategoryChange = e => {
		this.setState({selectedCategory: e});
	};

	onCostTypeChange = e => {
		this.setState({selectedCostType: e});
	};

	onSubmit = async e => {
		e.preventDefault();
		this.setState({skip: 0, loading: true, initLoading: false, more: true});
		const search = this.state.query;
		const location = this.state.location;
		const category = this.state.selectedCategory;
		const isFree = this.state.selectedCostType === 'Free';
		const isPaid = this.state.selectedCostType === 'Paid';
		const now = new Date().toISOString();
		let queryString = '{\n';
		if (search.trim() !== '') {
			queryString += `search: "${search}"\n`;
		}
		if (location.trim() !== '') {
			queryString += `location: "${location}"\n`;
		}
		if (category.trim() !== '' && category.trim() !== 'All') {
			queryString += `category: "${category}"\n`;
		}
		if (isFree) {
			queryString += `isFree: true\n`;
		} else if (isPaid) {
			queryString += `isPaid: true\n`;
		}
		queryString += `dateAfter: "${now}"\n`;
		queryString += `registrationAfter: "${now}"\n`;
		queryString += `}`;
		this.setState({queryString});
		const requestQuery = `{
			events(query: ${queryString}
				orderBy: "dateTime_ASC"
				first: 1
				skip: 0) {
					id
					title
					description
					dateTime
					price
					address
					city
					postCode
					state
					country
					imageUrl
					creator {
						id
						firstName
						lastName
					}
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
			const skip = this.state.skip + 1;
			this.setState({
				searchResults: results.data.data.events,
				loading: false,
				skip
			});
		} catch (err) {
			console.log(err);
		}
	};

	onLoadMore = async () => {
		const requestQuery = `{
			events(query: ${this.state.queryString}
				orderBy: "dateTime_ASC"
				first: ${this.state.first}
				skip: ${this.state.skip}) {
					id
					title
					description
					dateTime
					price
					address
					city
					postCode
					state
					country
					imageUrl
					creator {
						id
						firstName
						lastName
					}
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
			const skip = this.state.skip + 1;
			this.setState(prevState => {
				const searchResults =
					results.data.data.events.length > 0
						? [...prevState.searchResults, ...results.data.data.events]
						: [...prevState.searchResults];
				return {
					searchResults: searchResults,
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
			<React.Fragment>
				<Navbar {...this.props} />
				<div className={classes.searchForm}>
					<SearchForm
						query={this.state.query}
						onQueryChange={this.onQueryChange.bind(this)}
						location={this.state.location}
						onLocationChange={this.onLocationChange.bind(this)}
						categories={this.state.categories}
						selectedCategory={this.state.selectedCategory}
						onCategoryChange={this.onCategoryChange.bind(this)}
						costTypes={this.state.costTypes}
						selectedCostType={this.state.selectedCostType}
						onCostTypeChange={this.onCostTypeChange.bind(this)}
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
										<EventSearchResult event={item} />
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

export default SearchResults;
