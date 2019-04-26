import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Home from './pages/Home';
import User from './pages/User';
import Event from './pages/Event';
import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';
import Logout from './components/Logout';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Switch>
						{localStorage.getItem('isAuth') ? (
							<Route path="/dashboard" component={Dashboard} />
						) : (
							<Redirect from="/dashboard" to="/" />
						)}
						<Route path="/user/:id" component={User} />
						<Route path="/event/:id" component={Event} />
						<Route path="/search" component={SearchResults} />
						<Route path="/logout" component={Logout} />
						<Redirect from="/home" to="/" />
						<Route path="/" component={Home} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
