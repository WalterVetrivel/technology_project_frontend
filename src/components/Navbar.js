import React from 'react';
import {Link} from 'react-router-dom';
import {Affix, Icon} from 'antd';
import SignupDrawer from './SignupDrawer';
import classes from './styles/Navbar.module.scss';

const navbar = props => (
	<Affix>
		<nav className={classes.navbar}>
			<h2>
				<Link to="/">
					<Icon type="home" />
					EB
				</Link>
			</h2>
			{localStorage.getItem('isAuth') ? (
				<ul>
					<li>
						<Link to={`/user/${localStorage.getItem('userId')}`}>Profile</Link>
					</li>
					<li>
						<Link to="/logout">
							<Icon type="logout" />
							Logout
						</Link>
					</li>
				</ul>
			) : (
				<SignupDrawer size="default" text="Signup/Login" {...props} />
			)}
		</nav>
	</Affix>
);

export default navbar;
