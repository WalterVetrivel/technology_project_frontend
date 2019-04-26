import React from 'react';
import {message} from 'antd';
import {Redirect} from 'react-router-dom';

const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('userId');
	localStorage.removeItem('email');
	localStorage.removeItem('name');
	localStorage.removeItem('isAuth');

	message.success('Logged out successfully');

	return <Redirect to="/" />;
};

export default logout;
