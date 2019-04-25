import React from 'react';
import {Link} from 'react-router-dom';
import {Affix, Button} from 'antd';
import SignupDrawer from './SignupDrawer';
import classes from './styles/Navbar.module.scss';

const navbar = props => (
	<Affix>
		<nav className={classes.navbar}>
			<h2>Event Booker</h2>
			<ul className={classes.navbarNav}>
				<li>
					{props.isAuth ? (
						<Link to="/dashboard">
							<Button size="large" type="primary">Dashboard</Button>
						</Link>
					) : (
						<SignupDrawer {...props} />
					)}
				</li>
			</ul>
		</nav>
	</Affix>
);

export default navbar;