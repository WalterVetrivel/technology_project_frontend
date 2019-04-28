import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Home from './pages/Home';
import User from './pages/User';
import Event from './pages/Event';
import Search from './pages/Search';
import Logout from './components/Auth/Logout';
import Footer from './components/Layout/Footer';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Switch>
						<Route
							path="/user/:id"
							render={props => <User key={props.match.params.id} {...props} />}
						/>
						<Route path="/event/:id" component={Event} />
						<Route path="/search" component={Search} />
						<Route path="/logout" component={Logout} />
						<Redirect from="/home" to="/" />
						<Redirect from="/index" to="/" />
						<Route path="/" component={Home} />
					</Switch>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
