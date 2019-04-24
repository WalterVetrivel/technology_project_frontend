import React, {Component} from 'react';
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

class CreateEvent extends Component {
	state = {
		title: '',
		description: '',
		dateTime: null,
		registrationDeadline: null,
		price: null,
		selectedCountry: '',
		selectedState: '',
		selectedCity: '',
		imageUrl: '',
		categories: [
			'food',
			'music',
			'entertainment',
			'education',
			'job',
			'religion',
			'charity',
			'sale'
		],
		selectedCategories: [],
		allCountries: [],
		allStates: [],
		allCities: []
	};

	async componentDidMount() {
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
		const states = countryApi.getStatesOfCountry(e);
		this.setState({
			allStates: states.map(state => {
				return {
					code: state.id,
					name: state.name
				};
			})
		});
	};

	onStateChange = async e => {
		this.setState({selectedState: e});
		const cities = countryApi.getCitiesOfState(e);
		this.setState({
			allCities: cities.map(city => {
				return {
					code: city.id,
					name: city.name
				};
			})
		});
	};

	onCityChange = e => {
		this.setState({selectedCity: e});
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

	onCategoriesChange = e => {
		this.setState(prevState => {
			return {
				selectedCategories: e
			};
		});
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
				<Col span={12}>
					<h1>Create Event</h1>
					<Form
						labelCol={{xs: {span: 24}, sm: {span: 8}}}
						wrapperCol={{xs: {span: 24}, sm: {span: 16}}}
						onSubmit={this.onSubmit}>
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
						{this.state.selectedCategories}
						<Form.Item label="Categories">
							<Select
								mode="tags"
								placeholder="Select categories"
								onChange={this.onCategoriesChange}>
								{this.state.categories.map(category => (
									<Select.Option key={category}>{category}</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="Country">
							<Select
								showSearch
								placeholder="Select your country"
								value={this.state.selectedCountry}
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
						<Form.Item label="State">
							<Select
								showSearch
								placeholder="Select your state"
								value={this.state.selectedState}
								onChange={this.onStateChange}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}>
								{this.state.allStates.map(state => (
									<Select.Option key={state.code} value={state.code}>
										{state.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="City">
							<Select
								showSearch
								placeholder="Select your city"
								value={this.state.selectedCity}
								onChange={this.onCityChange}
								filterOption={(input, option) =>
									option.props.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}>
								{this.state.allCities.map(city => (
									<Select.Option key={city.code} value={city.code}>
										{city.name}
									</Select.Option>
								))}
							</Select>
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

const WrappedCreateEventForm = Form.create({name: 'createEvent'})(CreateEvent);

export default WrappedCreateEventForm;
