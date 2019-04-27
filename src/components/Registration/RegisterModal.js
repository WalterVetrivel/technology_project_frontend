import React, {Component} from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import {Modal, Button, Alert, message} from 'antd';
import RegisterForm from './RegisterForm';
import axios from 'axios';

class RegisterModal extends Component {
	state = {
		name: '',
		visible: false
	};

	async componentDidMount() {
		try {
			const result = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				data: {
					query: `{
						currentUser {
							firstName
							lastName
							email
						}
					}`
				}
			});
			console.log(result);
			this.setState({
				name:
					result.data.data.currentUser.firstName +
					' ' +
					result.data.data.currentUser.lastName
			});
		} catch (err) {
			console.log(err);
			message.error('Something went wrong');
		}
	}

	showModal = () => {
		this.setState({visible: true});
	};

	hideModal = () => {
		this.setState({visible: false});
	};

	render() {
		return (
			<div>
				<Button
					type="primary"
					size={this.props.size}
					icon="form"
					onClick={this.showModal}>
					Register
				</Button>
				<Modal
					title={<h3>Register</h3>}
					visible={this.state.visible}
					onCancel={this.hideModal}
					destroyOnClose
					footer={null}>
					<Alert
						message="Registration Information"
						description={
							<div>
								<p>
									<strong>Name: </strong>
									{this.state.name}
								</p>
								<p>
									<strong>Event: </strong>
									{this.props.event.title}
								</p>
								<p>
									<strong>Price per ticket: </strong>
									{this.props.event.price}
								</p>
								<p>
									<strong>Event date: </strong>
									{new Date(this.props.event.dateTime).toLocaleDateString()}
								</p>
								<p>
									<strong>Event time: </strong>
									{new Date(this.props.event.dateTime).toLocaleTimeString()}
								</p>
							</div>
						}
						showIcon
					/>
					<StripeProvider apiKey={process.env.REACT_APP_STRIPE_TEST_KEY}>
						<Elements>
							<RegisterForm
								price={this.props.event.price}
								name={this.state.name}
								eventId={this.props.event.id}
								eventTitle={this.props.event.title}
								onComplete={this.hideModal.bind(this)}
							/>
						</Elements>
					</StripeProvider>
				</Modal>
			</div>
		);
	}
}

export default RegisterModal;
