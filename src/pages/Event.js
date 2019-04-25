import React, {Component} from 'react';

class Event extends Component {
	state = {
		displayedEvent: null
	};

	componentDidMount() {
		console.log(this.props);
		const eventId = this.props.match.params.id;
		console.log(eventId);
	}

	render() {
		return <h1>This is the event page</h1>;
	}
}

export default Event;
