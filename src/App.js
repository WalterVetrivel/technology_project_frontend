import React, {Component} from 'react';
import {PageHeader, Form, Icon, Button, Input, Row, Col} from 'antd';
import RegistrationForm from './components/Registration';
import CreateEventForm from './components/CreateEvent';
import axios from 'axios';
import GoogleMapReact from 'google-map-react';

class App extends Component {
	state = {
		address: '',
		country: '',
		state: '',
		city: '',
		postCode: '',
		showMap: false,
		location: {lat: 0, lng: 0}
	};

	async componentDidMount() {
		/* const results = await axios({
			method: 'POST',
			url: 'http://localhost:4000',
			data: {
				query: `
				{
					users {
						firstName
					}
				}`
			}
		});
		console.log(results); */
	}

	onSubmit = e => {
		e.preventDefault();
	};

	onAddressChange = e => {
		this.setState({address: e.target.value});
	};
	onCityChange = e => {
		this.setState({city: e.target.value});
	};
	onPostalChange = e => {
		this.setState({postCode: e.target.value});
	};
	onStateChange = e => {
		this.setState({state: e.target.value});
	};
	onCountryChange = e => {
		this.setState({country: e.target.value});
	};

	onSubmitAddress = async e => {
		e.preventDefault();
		const addressString = `${this.state.address},${this.state.city},${
			this.state.postCode
		},${this.state.state},${this.state.country}`;
		if (addressString && addressString.trim() !== ',,,,') {
			const geocodeInfo = await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${addressString.trim()}&key=${
					process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY
				}`
			);
			const location = geocodeInfo.data.results[0].geometry.location;
			this.setState({
				location: {lat: location.lat, lng: location.lng},
				showMap: true
			});
		}
	};

	render() {
		return (
			<div className="App">
				<PageHeader
					backIcon={false}
					title="Event Booker"
					subTitle="Booking events made easy">
					<Form layout="inline" onSubmit={this.onSubmit.bind(this)}>
						<Form.Item>
							<Input prefix={<Icon type="user" />} placeholder="Username" />
						</Form.Item>
						<Form.Item>
							<Input prefix={<Icon type="lock" />} placeholder="Password" />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								Log in
							</Button>
						</Form.Item>
					</Form>
				</PageHeader>
				<Row type="flex" justify="center">
					<Col span={8}>
						<Form
							layout="horizontal"
							onSubmit={this.onSubmitAddress.bind(this)}>
							<Form.Item label="Street Address">
								<Input
									placeholder="Eg. 20, Ark street"
									value={this.state.address}
									onChange={this.onAddressChange}
								/>
							</Form.Item>
							<Form.Item label="City">
								<Input
									placeholder="Eg. Canberra"
									value={this.state.city}
									onChange={this.onCityChange}
								/>
							</Form.Item>
							<Form.Item label="Postal Code">
								<Input
									placeholder="Eg. 2617"
									value={this.state.postCode}
									onChange={this.onPostalChange}
								/>
							</Form.Item>
							<Form.Item label="State">
								<Input
									placeholder="Eg. ACT"
									value={this.state.state}
									onChange={this.onStateChange}
								/>
							</Form.Item>
							<Form.Item label="Country">
								<Input
									placeholder="Eg. Australia"
									value={this.state.country}
									onChange={this.onCountryChange}
								/>
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Show Map
								</Button>
							</Form.Item>
						</Form>
						{this.state.showMap ? (
							<div style={{height: '400px', width: '100%'}}>
								<GoogleMapReact
									bootstrapURLKeys={{
										key: process.env.REACT_APP_GOOGLE_MAPS_EMBED_KEY
									}}
									defaultCenter={this.state.location}
									defaultZoom={17}>
									<Icon
										type="down-circle"
										theme="twoTone"
										lat={this.state.location.lat}
										lng={this.state.location.lng}
									/>
								</GoogleMapReact>
							</div>
						) : (
							'Map will be displayed here'
						)}
					</Col>
				</Row>
				<RegistrationForm />
				<CreateEventForm />
			</div>
		);
	}
}

export default App;
