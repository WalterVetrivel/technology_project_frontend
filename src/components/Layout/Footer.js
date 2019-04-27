import React from 'react';
import {Row, Col} from 'antd';
import classes from '../styles/Footer.module.scss';

const footer = () => (
	<footer className={classes.footer}>
		<Row>
			<Col sm={12} xs={24}>
				<p>
					Copyright &copy; Event Booker {new Date().getFullYear()}. All rights
					reserved.
				</p>
			</Col>
			<Col sm={12} xs={24}>
				<ul>
					<li>Privacy policy</li>
					<li>Terms of service</li>
				</ul>
			</Col>
		</Row>
	</footer>
);

export default footer;
