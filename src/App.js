import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Home from './pages/Home';
import Event from './pages/Event';
import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';

class App extends Component {
	state = {
		isAuth: false
	};

	componentDidMount() {
		const token = localStorage.getItem('token');
		if (token) {
			this.setState({isAuth: true});
		}
	}

	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Switch>
						{this.state.isAuth ? (
							<Route path="/dashboard" component={Dashboard} />
						) : (
							<Redirect from="/dashboard" to="/" />
						)}
						<Route path="/event/:id" component={Event} />
						<Route path="/search" component={SearchResults} />
						<Redirect from="/home" to="/" />
						<Route path="/" component={Home} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
