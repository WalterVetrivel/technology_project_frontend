import React, {Component} from 'react';
import {Form, Button, Input, Row, message} from 'antd';
import axios from 'axios';

class LoginForm extends Component {
	state = {
		email: '',
		password: '',
		loading: '',
		error: ''
	};

	onEmailChange = e => {
		this.setState({email: e.target.value});
	};

	onPasswordChange = e => {
		this.setState({password: e.target.value});
	};

	onSubmit = async e => {
		e.preventDefault();
		this.setState({loading: true});
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
		const mutationString = `mutation {
			login(data: {
				email: "${this.state.email}"
				password: "${this.state.password}"
			}) {
				user {
					id
					firstName
					lastName
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
			localStorage.setItem('token', result.data.data.login.token);
			localStorage.setItem('userId', result.data.data.login.user.id);
			localStorage.setItem('isAuth', true);
			this.setState({
				email: '',
				password: '',
				loading: false,
				error: false
			});
			message.success('Logged in successfully!');
			this.props.history.push('/');
		} catch (err) {
			console.log(err);
			this.setState({
				email: '',
				password: '',
				loading: false,
				error: false
			});
		}
	};

	render() {
		return (
			<React.Fragment>
				<h1>Login</h1>
				<Form onSubmit={this.onSubmit}>
					<Form.Item label="Email">
						<Input
							type="email"
							placeholder="Eg. example@example.com"
							value={this.state.email}
							onChange={this.onEmailChange}
						/>
					</Form.Item>
					<Form.Item label="Password">
						<Input
							type="password"
							placeholder="Your password here"
							value={this.state.password}
							onChange={this.onPasswordChange}
						/>
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
