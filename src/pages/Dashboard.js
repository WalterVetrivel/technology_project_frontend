import React, {Component} from 'react';

class Dashboard extends Component {
	componentDidMount() {
		console.log(this.props);
	}

	render() {
		return <h1>This is the dashboard page</h1>;
	}
}

export default Dashboard;
