import React, {Component} from 'react';
import {
	Form,
	Button,
	Row,
	Col,
	InputNumber,
	message,
	notification,
	Statistic,
	Spin
} from 'antd';
import {CardElement, injectStripe} from 'react-stripe-elements';
import axios from 'axios';

class RegisterForm extends Component {
	state = {
		guestCount: 1,
		totalPrice: 0,
		loading: false
	};

	componentDidMount() {
		this.setState({totalPrice: this.props.price});
	}

	onGuestCountChange = e => {
		if (!isNaN(e)) {
			const guestCount = parseInt(e);
			const totalPrice = this.props.price * guestCount;
			this.setState({guestCount, totalPrice});
		}
	};

	onSubmit = async e => {
		e.preventDefault();
		this.setState({loading: true});
		const token = await this.props.stripe.createToken({
			name: this.props.name
		});
		const tokenId = token.token.id;
		const requestQuery = `mutation {
			createRegistration(data: {
				event: "${this.props.eventId}"
				guestCount: ${parseInt(this.state.guestCount)}
				paymentInfo: "${tokenId}"
			}) {
				id
				event {
					title
					dateTime
				}
				user {
					firstName
					lastName
				}
				guestCount
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
			message.success('Registered successfully!');
			notification.open({
				message: `Registered for ${this.props.eventTitle}`,
				description: `${this.props.name} $${this.state.totalPrice}`,
				duration: 0
			});
			this.setState({loading: false});
			this.props.onComplete();
		} catch (err) {
			message.error('Could not register. Please try later.');
			console.log(err);
			this.setState({loading: false});
		}
	};

	render() {
		return this.state.loading ? (
			<Spin />
		) : (
			<Row type="flex" justify="center">
				<Col span={20}>
					<Row type="flex" justify="center">
						<Statistic
							value={this.state.totalPrice}
							precision={2}
							title="Total Price"
						/>
					</Row>
					<Form onSubmit={this.onSubmit}>
						<Form.Item label="Number of tickets">
							<InputNumber
								value={this.state.guestCount}
								onChange={this.onGuestCountChange}
								required
							/>
						</Form.Item>
						<Form.Item label="Card details (for payment)">
							<CardElement />
						</Form.Item>
						<Row type="flex" justify="end">
							<Form.Item>
								<Button
									htmlType="submit"
									type="primary"
									size="large"
									icon="check-circle">
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

const WrappedRegisterForm = Form.create({name: 'register'})(
	injectStripe(RegisterForm)
);

export default WrappedRegisterForm;
