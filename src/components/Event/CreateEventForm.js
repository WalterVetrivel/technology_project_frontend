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
		imageUrl: '',
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

	onSubmit = async e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
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
						title: "${values.title}"
						description: "${values.description}"
						price: ${values.price}
						category: "${values.category}"
						dateTime: "${new Date(values.dateTime).toISOString()}"
						registrationDeadline: "${new Date(values.registrationDeadline).toISOString()}"
						address: "${values.address}"
						city: "${values.city}"
						postCode: "${values.postCode}"
						state: "${values.state}"
						country: "${values.country}"
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
					console.log(result);
					message.success('Event created successfully!');
					this.setState({
						imageUrl: ''
					});
					this.props.onFinish();
				} catch (err) {
					message.error('Could not create event.');
					console.log(err);
				}
			}
		});
	};

	render() {
		const {getFieldDecorator} = this.props.form;

		return (
			<Row type="flex" justify="center">
				<Col span={20}>
					<Form onSubmit={this.onSubmit}>
						<Form.Item label="Title">
							{getFieldDecorator('title', {
								rules: [{required: true, message: 'Please enter event title'}]
							})(<Input placeholder="Eg. Dinner" />)}
						</Form.Item>

						<Form.Item label="Description">
							{getFieldDecorator('description', {
								rules: [{required: true, message: 'Please enter description'}]
							})(
								<Input.TextArea
									placeholder="Eg. Doe"
									rows={5}
									style={{resize: 'none'}}
								/>
							)}
						</Form.Item>

						<Form.Item label="Price (AUD$)">
							{getFieldDecorator('price', {
								rules: [{required: true, message: 'Please enter ticket price'}]
							})(<InputNumber placeholder="Eg. 15.99" />)}
						</Form.Item>

						<Form.Item label="Category">
							{getFieldDecorator('category', {
								rules: [{required: true, message: 'Please select a category'}]
							})(
								<Select placeholder="Select category">
									{this.state.categories.map(category => (
										<Select.Option key={category} value={category}>
											{category}
										</Select.Option>
									))}
								</Select>
							)}
						</Form.Item>

						<Form.Item label="Date and Time">
							{getFieldDecorator('dateTime', {
								rules: [
									{
										required: true,
										message: 'Please select event date and time'
									}
								]
							})(<DatePicker showTime />)}
						</Form.Item>

						<Form.Item label="Registration Deadline">
							{getFieldDecorator('registrationDeadline', {
								rules: [
									{
										required: true,
										message: 'Please select registration deadline'
									}
								]
							})(<DatePicker showTime />)}
						</Form.Item>

						<Form.Item label="Address">
							{getFieldDecorator('address', {
								rules: [{required: true, message: 'Please enter event address'}]
							})(<Input placeholder="Eg. 20, North Street" />)}
						</Form.Item>

						<Form.Item label="City">
							{getFieldDecorator('city', {
								rules: [{required: true, message: 'Please enter city'}]
							})(<Input placeholder="Eg. Canberra" />)}
						</Form.Item>

						<Form.Item label="Post Code">
							{getFieldDecorator('postCode', {
								rules: [{required: true, message: 'Please enter post code'}]
							})(<Input placeholder="Eg. 2617" />)}
						</Form.Item>

						<Form.Item label="Region">
							{getFieldDecorator('state', {
								rules: [
									{required: true, message: 'Please enter state or region'}
								]
							})(<Input placeholder="Eg. New South Wales" />)}
						</Form.Item>

						<Form.Item label="Country">
							{getFieldDecorator('country', {
								rules: [{required: true, message: 'Please select country'}]
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
