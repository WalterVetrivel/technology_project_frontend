import React, {Component} from 'react';
import {Form, Button, Input, Row, Col, DatePicker} from 'antd';
import axios from 'axios';

class Registration extends Component {
	state = {
		firstName: '',
		lastName: '',
		dateOfBirth: null,
		email: '',
		location: ''
	};

	onFirstNameChange = e => {
		this.setState({firstName: e.target.value});
	};

	onLastNameChange = e => {
		this.setState({lastName: e.target.value});
	};

	onEmailChange = e => {
		this.setState({email: e.target.value});
	};

	onPasswordChange = e => {
		this.setState({password: e.target.value});
	};

	onLocationChange = e => {
		this.setState({location: e.target.value});
	};

	onDateOfBirthChange = e => {
		if (e) {
			console.log(new Date(e._i).toISOString());
			this.setState({dateOfBirth: e});
		}
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
			createUser(data: {
				firstName: "${this.state.firstName}"
				lastName: "${this.state.lastName}"
				dateOfBirth: "${new Date(this.state.dateOfBirth._i).toISOString()}"
				email: "${this.state.email}"
				password: "${this.state.password}"
				location: "${this.state.location}"
			}) {
				user {
					id
					firstName
					lastName
				}
				token
			}
		}`;
		const result = await axios({
			method: 'POST',
			url: 'http://localhost:4000',
			data: {
				query: mutationString
			}
		});
		console.log(result);
	};

	render() {
		return (
			<Row type="flex" justify="center">
				<Col span={12}>
					<h1>Register</h1>
					<Form
						labelCol={{xs: {span: 24}, sm: {span: 8}}}
						wrapperCol={{xs: {span: 24}, sm: {span: 16}}}
						onSubmit={this.onSubmit}>
						<Form.Item label="First Name">
							<Input
								placeholder="Eg. John"
								value={this.state.firstName}
								onChange={this.onFirstNameChange}
							/>
						</Form.Item>
						<Form.Item label="Last Name">
							<Input
								placeholder="Eg. Doe"
								value={this.state.lastName}
								onChange={this.onLastNameChange}
							/>
						</Form.Item>
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
						<Form.Item label="Location">
							<Input
								placeholder="Eg. Australia"
								value={this.state.location}
								onChange={this.onLocationChange}
							/>
						</Form.Item>
						<Form.Item label="Date of Birth">
							<DatePicker
								value={this.state.dateOfBirth}
								onChange={this.onDateOfBirthChange}
							/>
						</Form.Item>
						<Row type="flex" justify="end">
							<Form.Item>
								<Button htmlType="submit" type="primary">
									Register
								</Button>
							</Form.Item>
						</Row>
					</Form>
				</Col>
			</Row>
		);
	}
}

const WrappedRegistrationForm = Form.create({name: 'registration'})(
	Registration
);

export default WrappedRegistrationForm;
