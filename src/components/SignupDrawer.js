import React, {Component} from 'react';
import {Drawer, Tabs, Button, Icon} from 'antd';
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
				<Button
					type="primary"
					size="large"
					onClick={this.showDrawer}
					icon="login">
					Signup/Login
				</Button>
				<Drawer
					title="Sign up to start hosting events"
					width={'85%'}
					onClose={this.onClose}
					visible={this.state.visible}>
					<Tabs defaultActiveKey="1">
						<TabPane
							tab={
								<React.Fragment>
									<Icon type="form" />
									Signup
								</React.Fragment>
							}
							key={1}>
							<SignupForm {...this.props} onFinish={this.onClose.bind(this)} />
						</TabPane>
						<TabPane
							tab={
								<React.Fragment>
									<Icon type="login" />
									Login
								</React.Fragment>
							}
							key={2}>
							<LoginForm {...this.props} onFinish={this.onClose.bind(this)} />
						</TabPane>
					</Tabs>
				</Drawer>
			</div>
		);
	}
}

export default SignupDrawer;
