import React from 'react';
import {Link} from 'react-router-dom';
import {Affix, Icon} from 'antd';
import SignupDrawer from '../Auth/SignupDrawer';
import CreateEventModal from '../Event/CreateEventModal';
import classes from '../styles/Navbar.module.scss';

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
						<CreateEventModal />
					</li>
					<li>
						<Link to="/search">Search</Link>
					</li>
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
				<ul>
					<li>
						<Link to="/search">Search</Link>
					</li>
					<li>
						<SignupDrawer size="default" text="Signup/Login" {...props} />
					</li>
				</ul>
			)}
		</nav>
	</Affix>
);

export default navbar;
