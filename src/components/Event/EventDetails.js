import React from 'react';
import {Row, Col, Icon, Divider} from 'antd';
import GoogleMapReact from 'google-map-react';

const eventDetails = ({event, location}) => (
	<Row gutter={16}>
		<Col xs={24} md={16}>
			<Row gutter={8}>
				<Col xs={24} sm={12}>
					<Icon type="user" />
					&nbsp;
					{event.creator.firstName + ' ' + event.creator.lastName}
				</Col>
				<Col xs={24} sm={12}>
					<Icon type="tag" />
					&nbsp;{event.category}
				</Col>
				<Col xs={24} sm={12}>
					<Icon type="calendar" />
					&nbsp;
					{new Date(event.dateTime).toLocaleDateString()}
				</Col>
				<Col xs={24} sm={12}>
					<Icon type="clock-circle" />
					&nbsp;
					{new Date(event.dateTime).toLocaleTimeString()}
				</Col>
			</Row>
			<Divider />
			<div>
				<h2>About event</h2>
				<p>{event.description}</p>
			</div>
		</Col>
		<Col xs={24} md={8}>
			<div>
				<Icon type="home" />
				&nbsp;
				{`${event.address}, `}
				<br />
				{`${event.city}, ${event.postCode},`}
				<br />
				{`${event.state}, ${event.country}`}
			</div>
			<h3>Map</h3>
			<div style={{width: '100%', height: '300px'}}>
				<GoogleMapReact
					bootstrapURLKeys={{
						key: process.env.REACT_APP_GOOGLE_MAPS_EMBED_KEY
					}}
					defaultCenter={location}
					defaultZoom={17}>
					<Icon
						type="down-circle"
						theme="twoTone"
						lat={location.lat}
						lng={location.lng}
					/>
				</GoogleMapReact>
			</div>
		</Col>
	</Row>
);

export default eventDetails;
