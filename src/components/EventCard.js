import React from 'react';
import {Card, Row, Typography, Icon} from 'antd';
import {Link} from 'react-router-dom';

const {Paragraph} = Typography;

const eventCard = ({event}) => (
	<Card
		hoverable
		cover={
			<img
				alt={event.title}
				src={
					event.imageUrl ? event.imageUrl : 'https://via.placeholder.com/100'
				}
			/>
		}
		actions={[<Link to={`/event/${event.id}`}>View Event</Link>]}>
		<Card.Meta
			title={
				<Row type="flex" justify="space-between">
					<h3>{event.title}</h3>
					<strong>${event.price.toFixed(2)}</strong>
				</Row>
			}
			description={
				<Paragraph ellipsis={{rows: 2, expandable: true}}>
					{event.description}
				</Paragraph>
			}
		/>
		<p>
			<strong>
				<Icon type="calendar" />
				&nbsp;
				{new Date(event.dateTime).toLocaleString()}
			</strong>
		</p>
		<p>
			<b>
				<Icon type="home" />
				&nbsp;
			</b>
			{`${event.address}, ${event.city}, ${event.postCode}, ${event.state}`}
		</p>
	</Card>
);

export default eventCard;
