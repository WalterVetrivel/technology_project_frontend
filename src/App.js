import React, {Component} from 'react';
import {PageHeader, Form, Icon, Button, Input} from 'antd';
import RegistrationForm from './Registration';
import axios from 'axios';

class App extends Component {
	state = {
		events: []
	};

	async componentDidMount() {
		const results = await axios({
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
		console.log(results);
	}

	onSubmit = e => {
		e.preventDefault();
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
				<RegistrationForm />
			</div>
		);
	}
}

export default App;
