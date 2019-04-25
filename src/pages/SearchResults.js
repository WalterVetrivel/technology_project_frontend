import React, {Component} from 'react';
import SearchForm from '../components/SearchForm';
import Navbar from '../components/Navbar';
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
			'Other'
		],
		selectedCategory: 'All',
		costTypes: ['Free', 'Paid', 'All'],
		selectedCostType: 'All'
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
		const requestQuery = `{
			events(query: ${queryString}
				orderBy: "dateTime_ASC") {
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
			console.log(results.data.data.events);
		} catch (err) {
			console.log(err);
		}
	};

	render() {
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
				<main className={classes.main} />
			</React.Fragment>
		);
	}
}

export default SearchResults;
