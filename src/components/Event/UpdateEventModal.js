import React, {Component} from 'react';
import {Modal, Button} from 'antd';
import UpdateEventForm from './UpdateEventForm';

class UpdateEventModal extends Component {
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
					icon="edit"
					onClick={this.showModal}>
					Edit Event
				</Button>
				<Modal
					title={<h3>Edit Event</h3>}
					visible={this.state.visible}
					onCancel={this.hideModal}
					destroyOnClose
					footer={null}>
					<UpdateEventForm
						event={this.props.event}
						onFinish={this.hideModal.bind(this)}
					/>
				</Modal>
			</div>
		);
	}
}

export default UpdateEventModal;
