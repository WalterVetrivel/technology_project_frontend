import React, {Component} from 'react';
import {Drawer, Tabs, Button} from 'antd';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
const {TabPane} = Tabs;

class SignupDrawer extends Component {
	state = {
		visible: false
	};

	showDrawer = () => {
		this.setState({visible: true});
	};

	onClose = () => {
		this.setState({visible: false});
	};

	render() {
		return (
			<div>
				<Button type="primary" size="large" onClick={this.showDrawer}>
					Signup/Login
				</Button>
				<Drawer
					title="Sign up to start hosting events"
					width={'85%'}
					onClose={this.onClose}
					visible={this.state.visible}>
					<Tabs defaultActiveKey="1">
						<TabPane tab="Signup" key={1}>
							<SignupForm {...this.props} />
						</TabPane>
						<TabPane tab="Login" key={2}>
							<LoginForm {...this.props} />
						</TabPane>
					</Tabs>
				</Drawer>
			</div>
		);
	}
}

export default SignupDrawer;
