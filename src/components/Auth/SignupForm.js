import React, {Component} from 'react';
import {Form, Button, Input, Row, DatePicker, Select, message} from 'antd';
import countryApi from 'country-state-city';
import axios from 'axios';

class SignupForm extends Component {
	state = {
		firstName: '',
		lastName: '',
		dateOfBirth: null,
		email: '',
		password: '',
		city: '',
		state: '',
		country: '',
		allCountries: [],
		allStates: [],
		allCities: [],
		loading: false,
		error: false
	};

	componentDidMount() {
		console.log(this.props);
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

	onCountryChange = async e => {
		this.setState({country: e});
	};

	onStateChange = async e => {
		this.setState({state: e.target.value});
	};

	onCityChange = e => {
		this.setState({city: e.target.value});
	};

	onDateOfBirthChange = e => {
		if (e) {
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
		const mutationString = `mutation {
			createUser(data: {
				firstName: "${this.state.firstName.toLowerCase()}"
				lastName: "${this.state.lastName.toLowerCase()}"
				dateOfBirth: "${new Date(this.state.dateOfBirth._d).toISOString()}"
				email: "${this.state.email}"
				password: "${this.state.password}"
				country: "${countryApi.getCountryById(this.state.country).name}"
				state: "${countryApi.getStateById(this.state.state).name}"
				city: "${countryApi.getCityById(this.state.city).name}"
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
				firstName: '',
				lastName: '',
				dateOfBirth: null,
				email: '',
				city: '',
				state: '',
				country: '',
				password: '',
				allCountries: [],
				loading: false,
				error: false
			});
			message.success('Signup successful!');
			window.location.reload();
		} catch (err) {
			console.log(err);
			message.error('Could not signup. Something went wrong.');
			this.setState({
				firstName: '',
				lastName: '',
				dateOfBirth: null,
				email: '',
				city: '',
				state: '',
				country: '',
				allCountries: [],
				loading: false,
				error: true
			});
		}
	};

	render() {
		return (
			<React.Fragment>
				<h1>Register</h1>
				<Form onSubmit={this.onSubmit}>
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
					<Form.Item label="Country">
						<Select
							showSearch
							placeholder="Select your country"
							value={this.state.country}
							onChange={this.onCountryChange}
							filterOption={(input, option) =>
								option.props.children
									.toLowerCase()
									.indexOf(input.toLowerCase()) >= 0
							}>
							{this.state.allCountries.map(country => (
								<Select.Option key={country.code} value={country.code}>
									{country.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Region">
						<Input
							placeholder="Eg. New South Wales"
							value={this.state.state}
							onChange={this.onStateChange}
						/>
					</Form.Item>
					<Form.Item label="City">
						<Input
							placeholder="Eg. Canberra"
							value={this.state.city}
							onChange={this.onCityChange}
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
			</React.Fragment>
		);
	}
}

const WrappedSignupForm = Form.create({name: 'signup'})(SignupForm);

export default WrappedSignupForm;
