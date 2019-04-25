import React from 'react';
import {Link} from 'react-router-dom';
import {Affix, Menu, Icon} from 'antd';
import SignupDrawer from './SignupDrawer';
import classes from './styles/Navbar.module.scss';

const navbar = props => (
	<Affix>
		<nav className={classes.navbar}>
			<h2>
				<Link to="/">
					<Icon type="home" />
					Event Booker
				</Link>
			</h2>
			{localStorage.getItem('isAuth') ? (
				<Menu mode="horizontal">
					<Menu.Item key="dashboard">
						<Link to="/dashboard">Dashboard</Link>
					</Menu.Item>
					<Menu.Item key="logout">
						<Link to="/logout">
							<Icon type="logout" />
							Logout
						</Link>
					</Menu.Item>
				</Menu>
			) : (
				<SignupDrawer {...props} />
			)}
		</nav>
	</Affix>
);

export default navbar;
