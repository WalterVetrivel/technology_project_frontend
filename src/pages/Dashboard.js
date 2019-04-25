import React, {Component} from 'react';
import Navbar from '../components/Navbar';

class Dashboard extends Component {
	componentDidMount() {
		console.log(this.props);
	}

	render() {
		return (
			<React.Fragment>
				<Navbar {...this.props} />
				This is the dashboard page
			</React.Fragment>
		);
	}
}

export default Dashboard;
