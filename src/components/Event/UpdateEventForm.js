import React, {Component} from 'react';
import {
	Form,
	Button,
	Input,
	Row,
	Col,
	DatePicker,
	InputNumber,
	message
} from 'antd';
import axios from 'axios';

class UpdateEventForm extends Component {
	componentDidMount() {
		this.props.form.setFields({
			title: {value: this.props.event.title},
			description: {value: this.props.event.description},
			price: {value: this.props.event.price},
			dateTime: {value: this.props.event.dateTime},
			address: {value: this.props.event.address},
			registrationDeadline: {value: this.props.event.registrationDeadline}
		});
		console.log(this.props.form);
	}

	onSubmit = async e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const requestQuery = `mutation {
					updateEvent(id: "${this.props.event.id}"
						data: {
							title: "${values.title}"
							description: "${values.description}"
							price: ${values.price}
							dateTime: "${values.dateTime}"
							address: "${values.address}"
							registrationDeadline: "${values.registrationDeadline}"
						}) {
							id
							title
							description
							price
							dateTime
							address
							registrationDeadline
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
					message.success('Event updated successfully!');
					this.props.onFinish();
				} catch (err) {
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

const WrappedUpdateEventForm = Form.create({name: 'updateEvent'})(
	UpdateEventForm
);

export default WrappedUpdateEventForm;
