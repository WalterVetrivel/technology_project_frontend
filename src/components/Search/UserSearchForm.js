import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';

const userSearchForm = props => (
	<Form onSubmit={props.onSubmit}>
		<Row gutter={16} type="flex" justify="center">
			<Col xs={24} sm={12} md={6}>
				<Form.Item label="Name">
					<Input
						value={props.name}
						onChange={props.onNameChange}
						placeholder="Eg. John"
					/>
				</Form.Item>
			</Col>
			<Col xs={24} sm={12} md={6}>
				<Form.Item label="Location">
					<Input
						value={props.location}
						onChange={props.onLocationChange}
						placeholder="Eg. Canberra"
					/>
				</Form.Item>
			</Col>
		</Row>
		<Row type="flex" justify="center">
			<Form.Item>
				<Button type="primary" htmlType="submit" icon="search">
					Search
				</Button>
			</Form.Item>
		</Row>
	</Form>
);

const WrappedUserSearchForm = Form.create({name: 'userSearch'})(userSearchForm);

export default WrappedUserSearchForm;
