import React, {Component} from 'react';
import {Form, Button, Input, Row} from 'antd';
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
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
		console.log(this.state);
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
				url: 'http://localhost:4000',
				data: {
					query: mutationString
				}
			});
			console.log(result);
			this.setState({
				email: '',
				password: '',
				loading: false,
				error: false
			});
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
