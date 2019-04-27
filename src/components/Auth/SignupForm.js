import React, {Component} from 'react';
import {Form, Button, Input, Row, DatePicker, Select, message} from 'antd';
import countryApi from 'country-state-city';
import axios from 'axios';

class SignupForm extends Component {
	state = {
		confirmDirty: false,
		allCountries: [],
		loading: false,
		error: false
	};

	componentDidMount() {
		const countries = countryApi.getAllCountries();
		this.setState({
			allCountries: countries.map(country => {
				return {
					code: country.id,
					name: country.name
				};
			})
		});
	}

	compareToComfirmation = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirmPassword'], {force: true});
		}
		callback();
	};

	compareToOriginal = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback(`The passwords don't match`);
		} else {
			callback();
		}
	};

	onSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const mutationString = `mutation {
					createUser(data: {
						firstName: "${values.firstName}"
						lastName: "${values.lastName}"
						dateOfBirth: "${new Date(values.dateOfBirth._d).toISOString()}"
						email: "${values.email}"
						password: "${values.password}"
						country: "${values.country}"
						state: "${values.state}"
						city: "${values.city}"
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
					const loginInfo = result.data.data.createUser;
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
					message.success('Signup successful!');
					window.location.reload();
				} catch (err) {
					console.log(err);
					message.error('Could not signup. Something went wrong.');
					this.setState({
						loading: false,
						error: true
					});
				}
			}
		});
	};

	render() {
		const {getFieldDecorator} = this.props.form;

		return (
			<React.Fragment>
				<h1>Register</h1>
				<Form onSubmit={this.onSubmit}>
					<Form.Item label="First Name">
						{getFieldDecorator('firstName', {
							rules: [{required: true, message: 'Please enter your first name'}]
						})(<Input placeholder="Eg. John" />)}
					</Form.Item>

					<Form.Item label="Last Name">
						{getFieldDecorator('lastName', {
							rules: [{required: true, message: 'Please enter your last name'}]
						})(<Input placeholder="Eg. Doe" />)}
					</Form.Item>

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

					<Form.Item label="Confirm Password">
						{getFieldDecorator('confirmPassword', {
							rules: [
								{required: true, message: 'Please re-enter your password'},
								{validator: this.compareToOriginal}
							]
						})(
							<Input
								type="password"
								placeholder="Retype your password"
								onBlur={() => this.setState({confirmDirty: true})}
							/>
						)}
					</Form.Item>

					<Form.Item label="Country">
						{getFieldDecorator('country', {
							rules: [{required: true, message: 'Please select your country'}]
						})(
							<Select
								showSearch
								placeholder="Select your country"
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}>
								{this.state.allCountries.map(country => (
									<Select.Option key={country.name} value={country.name}>
										{country.name}
									</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>

					<Form.Item label="Region">
						{getFieldDecorator('state', {
							rules: [{required: true, message: 'Please enter your region'}]
						})(<Input placeholder="Eg. ACT" />)}
					</Form.Item>

					<Form.Item label="City">
						{getFieldDecorator('city', {
							rules: [{required: true, message: 'Please enter your city'}]
						})(<Input placeholder="Eg. Canberra" />)}
					</Form.Item>

					<Form.Item label="Date of Birth">
						{getFieldDecorator('dateOfBirth', {
							rules: [
								{required: true, message: 'Please enter your date of birth'}
							]
						})(<DatePicker required />)}
					</Form.Item>

					<Row type="flex" justify="end">
						<Form.Item>
							<Button htmlType="submit" type="primary">
								Register
							</Button>
						</Form.Item>
					</Row>
				</Form>
			</React.Fragment>
		);
	}
}

const WrappedSignupForm = Form.create({name: 'signup'})(SignupForm);

export default WrappedSignupForm;
