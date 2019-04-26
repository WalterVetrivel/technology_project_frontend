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
	Select
} from 'antd';
import Uploader from './Uploader';
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
		this.setState({selectedCountry: e});
	};

	onStateChange = async e => {
		this.setState({state: e.target.value});
	};

	onCityChange = e => {
		this.setState({city: e.target.value});
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
				console.log('Received values of form: ', values);
			}
		});
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
							/>
						</Form.Item>
						<Form.Item label="Price">
							<InputNumber
								placeholder="Eg. $15.99"
								value={this.state.price}
								onChange={this.onPriceChange}
							/>
						</Form.Item>
						<Form.Item label="Category">
							<Select
								placeholder="Select category"
								value={this.state.selectedCategory}
								onChange={this.onCategoryChange}>
								{this.state.categories.map(category => (
									<Select.Option key={category} value={category}>
										{category}
									</Select.Option>
								))}
							</Select>
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
						<Form.Item label="Date">
							<DatePicker
								showTime
								value={this.state.dateTime}
								onChange={this.onDateTimeChange}
							/>
						</Form.Item>
						<Form.Item label="Registration Deadline">
							<DatePicker
								showTime
								value={this.state.dateTime}
								onChange={this.onDateTimeChange}
							/>
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
								<Button htmlType="submit" type="primary">
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
