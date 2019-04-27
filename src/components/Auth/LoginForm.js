import React, {Component} from 'react';
import {Form, Button, Input, Row, message} from 'antd';
import axios from 'axios';

class LoginForm extends Component {
	state = {
		loading: '',
		error: ''
	};

	onSubmit = async e => {
		e.preventDefault();
		this.setState({loading: true});
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const mutationString = `mutation {
					login(data: {
						email: "${values.email}"
						password: "${values.password}"
					}) {
						user {
							id
							firstName
							lastName
							email
						}
						token
					}
				}`;
				try {
					const result = await axios({
						method: 'POST',
						url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
						data: {
							query: mutationString
						}
					});
					const loginInfo = result.data.data.login;
					localStorage.setItem('token', loginInfo.token);
					localStorage.setItem('userId', loginInfo.user.id);
					localStorage.setItem('email', loginInfo.user.email);
					localStorage.setItem(
						'name',
						`${loginInfo.user.firstName} ${loginInfo.user.lastName}`
					);
					localStorage.setItem('isAuth', true);
					this.setState({
						loading: false,
						error: false
					});
					message.success('Logged in successfully!');
					window.location.reload();
				} catch (err) {
					console.log(err);
					this.setState({
						loading: false,
						error: false
					});
				}
			}
		});
	};

	render() {
		const {getFieldDecorator} = this.props.form;

		return (
			<React.Fragment>
				<h1>Login</h1>
				<Form onSubmit={this.onSubmit}>
					<Form.Item label="Email">
						{getFieldDecorator('email', {
							rules: [
								{type: 'email', message: 'Please enter a valid email'},
								{required: true, message: 'Please enter your email'}
							]
						})(<Input type="email" placeholder="Eg. example@example.com" />)}
					</Form.Item>

					<Form.Item label="Password">
						{getFieldDecorator('password', {
							rules: [
								{required: true, message: 'Please enter your password'},
								{validator: this.compareToComfirmation}
							]
						})(<Input type="password" placeholder="Your password here" />)}
					</Form.Item>

					<Row type="flex" justify="end">
						<Form.Item>
							<Button htmlType="submit" type="primary">
								Login
							</Button>
						</Form.Item>
					</Row>
				</Form>
			</React.Fragment>
		);
	}
}

const WrappedLoginForm = Form.create({name: 'login'})(LoginForm);

export default WrappedLoginForm;
