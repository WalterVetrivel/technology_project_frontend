import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {
	Form,
	Button,
	Input,
	Row,
	Col,
	DatePicker,
	InputNumber,
	Select,
	message
} from 'antd';
import Uploader from '../Uploader';
import axios from 'axios';
import countryApi from 'country-state-city';

class CreateEventForm extends Component {
	state = {
		title: '',
		description: '',
		dateTime: null,
		registrationDeadline: null,
		price: null,
		country: '',
		state: '',
		city: '',
		imageUrl: '',
		address: '',
		postCode: '',
		categories: [
			'Food',
			'Music',
			'Religion',
			'Entertainment',
			'Movie',
			'Charity',
			'Rally',
			'Education',
			'Politics',
			'Social',
			'Job',
			'Sale',
			'Auction',
			'Fundraiser',
			'Other'
		],
		selectedCategory: '',
		allCountries: []
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

	onTitleChange = e => {
		this.setState({title: e.target.value});
	};

	onDescriptionChange = e => {
		this.setState({description: e.target.value});
	};

	onPriceChange = e => {
		if (!isNaN(e)) {
			this.setState({price: parseFloat(e)});
		}
		if (!e) {
			this.setState({price: null});
		}
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

	onAddressChange = e => {
		this.setState({address: e.target.value});
	};

	onPostCodeChange = e => {
		this.setState({postCode: e.target.value});
	};

	onDateTimeChange = e => {
		if (e) {
			this.setState({dateTime: e});
		}
	};

	onRegistrationDeadlineChange = e => {
		if (e) {
			this.setState({registrationDeadline: e});
		}
	};

	onCategoryChange = e => {
		this.setState({selectedCategory: e});
	};

	onSubmit = async e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
			}
		});
		const results = await axios({
			method: 'POST',
			url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
			data: {
				query: `{
					user(id: "${localStorage.getItem('userId')}") {
						firstName
						lastName
					}
				}`
			}
		});
		const token = await this.props.stripe.createToken({
			name: `${results.data.data.user.firstName} ${
				results.data.data.user.lastName
			}`
		});
		const requestQuery = `mutation {
			createEvent(data: {
				title: "${this.state.title}"
				description: "${this.state.description}"
				price: ${this.state.price}
				category: "${this.state.selectedCategory}"
				dateTime: "${new Date(this.state.dateTime).toISOString()}"
				registrationDeadline: "${new Date(
					this.state.registrationDeadline
				).toISOString()}"
				address: "${this.state.address}"
				city: "${this.state.city}"
				postCode: "${this.state.postCode}"
				state: "${this.state.state}"
				country: "${this.state.country}"
				imageUrl: "${this.state.imageUrl}"
				paymentInfo: "${token.token.id}"
			}) {
				id
				title
				creator {
					id
					firstName
					lastName
				}
			}
		}`;
		try {
			const result = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				data: {
					query: requestQuery
				}
			});
			console.log(result.data);
			message.success('Event created successfully!');
			this.setState({
				title: '',
				description: '',
				dateTime: null,
				registrationDeadline: null,
				price: null,
				country: '',
				state: '',
				city: '',
				imageUrl: '',
				address: '',
				postCode: '',
				categories: [
					'Food',
					'Music',
					'Religion',
					'Entertainment',
					'Movie',
					'Charity',
					'Rally',
					'Education',
					'Politics',
					'Social',
					'Job',
					'Sale',
					'Auction',
					'Fundraiser',
					'Other'
				],
				selectedCategory: ''
			});
		} catch (err) {
			message.error('Could not create event.');
			console.log(err);
		}
	};

	render() {
		return (
			<Row type="flex" justify="center">
				<Col span={20}>
					<Form onSubmit={this.onSubmit}>
						<Form.Item label="Title">
							<Input
								placeholder="Eg. Dinner"
								value={this.state.title}
								onChange={this.onTitleChange}
								required
							/>
						</Form.Item>
						<Form.Item label="Description">
							<Input.TextArea
								placeholder="Eg. Doe"
								rows={5}
								style={{resize: 'none'}}
								value={this.state.description}
								onChange={this.onDescriptionChange}
								required
							/>
						</Form.Item>
						<Form.Item label="Price">
							<InputNumber
								placeholder="Eg. $15.99"
								value={this.state.price}
								onChange={this.onPriceChange}
								required
							/>
						</Form.Item>
						<Form.Item label="Category">
							<Select
								placeholder="Select category"
								value={this.state.selectedCategory}
								onChange={this.onCategoryChange}
								required>
								{this.state.categories.map(category => (
									<Select.Option key={category} value={category}>
										{category}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="Date">
							<DatePicker
								showTime
								value={this.state.dateTime}
								onChange={this.onDateTimeChange}
								required
							/>
						</Form.Item>
						<Form.Item label="Registration Deadline">
							<DatePicker
								showTime
								value={this.state.registrationDeadline}
								onChange={this.onRegistrationDeadlineChange}
								required
							/>
						</Form.Item>
						<Form.Item label="Address">
							<Input
								placeholder="Eg. 20, North Street"
								value={this.state.address}
								onChange={this.onAddressChange}
								required
							/>
						</Form.Item>
						<Form.Item label="City">
							<Input
								placeholder="Eg. Canberra"
								value={this.state.city}
								onChange={this.onCityChange}
								required
							/>
						</Form.Item>
						<Form.Item label="Post Code">
							<Input
								placeholder="Eg. 2617"
								value={this.state.postCode}
								onChange={this.onPostCodeChange}
								required
							/>
						</Form.Item>
						<Form.Item label="Region">
							<Input
								placeholder="Eg. New South Wales"
								value={this.state.state}
								onChange={this.onStateChange}
								required
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
								}
								required>
								{this.state.allCountries.map(country => (
									<Select.Option key={country.name} value={country.name}>
										{country.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="Image">
							<Uploader
								id="file"
								name="file"
								onUploadComplete={info => {
									console.log('Upload completed:', info.cdnUrl);
									this.setState({imageUrl: info.cdnUrl});
								}}
							/>
						</Form.Item>
						<Form.Item label="Card details to receive payment">
							<CardElement />
						</Form.Item>
						<Row type="flex" justify="end">
							<Form.Item>
								<Button
									htmlType="submit"
									type="primary"
									size="large"
									icon="check-circle">
									Create Event
								</Button>
							</Form.Item>
						</Row>
					</Form>
				</Col>
			</Row>
		);
	}
}

const WrappedCreateEventForm = Form.create({name: 'createEvent'})(
	injectStripe(CreateEventForm)
);

export default WrappedCreateEventForm;
