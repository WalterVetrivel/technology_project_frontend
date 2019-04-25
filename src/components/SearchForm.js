import React from 'react';
import {Row, Col, Form, Input, Select, Button} from 'antd';

const searchForm = props => (
	<Form onSubmit={props.onSubmit}>
		<Row gutter={16}>
			<Col xs={24} sm={12} md={6}>
				<Form.Item label="Query">
					<Input
						value={props.query}
						onChange={props.onQueryChange}
						placeholder="Eg. Dinner"
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
			<Col xs={24} sm={12} md={6}>
				<Form.Item label="Category">
					<Select
						value={props.selectedCategory}
						onChange={props.onCategoryChange}
						placeholder="Eg. Food">
						{props.categories.map(category => (
							<Select.Option key={category} value={category}>
								{category}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Col>
			<Col xs={24} sm={12} md={6}>
				<Form.Item label="Cost Type">
					<Select
						value={props.selectedCostType}
						onChange={props.onCostTypeChange}
						placeholder="Eg. Free">
						{props.costTypes.map(costType => (
							<Select.Option key={costType} value={costType}>
								{costType}
							</Select.Option>
						))}
					</Select>
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

const WrappedSearchForm = Form.create({name: 'search'})(searchForm);

export default WrappedSearchForm;
