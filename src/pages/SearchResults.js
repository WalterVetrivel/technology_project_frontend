import React, {Component} from 'react';

class SearchResults extends Component {
	componentDidMount() {
		console.log(this.props);
	}

	render() {
		return <h1>This is the search results page</h1>;
	}
}

export default SearchResults;
