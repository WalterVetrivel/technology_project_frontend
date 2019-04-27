import React, {Component} from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import {Modal, Button} from 'antd';
import CreateEventForm from './CreateEventForm';

class CreateEventModal extends Component {
	state = {
		visible: false
	};

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
					size="large"
					icon="form"
					onClick={this.showModal}>
					Create Event
				</Button>
				<Modal
					title={<h3>Create Event</h3>}
					visible={this.state.visible}
					onCancel={this.hideModal}
					footer={null}>
					<StripeProvider apiKey={process.env.REACT_APP_STRIPE_TEST_KEY}>
						<Elements>
							<CreateEventForm />
						</Elements>
					</StripeProvider>
				</Modal>
			</div>
		);
	}
}

export default CreateEventModal;
