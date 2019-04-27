import React, {Component} from 'react';
import {Drawer, Tabs, Button, Icon, Row, Col} from 'antd';
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
					size={this.props.size}
					onClick={this.showDrawer}
					icon="login">
					{this.props.text}
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
							<Row type="flex" justify="center">
								<Col lg={12}>
									<SignupForm
										{...this.props}
										onFinish={this.onClose.bind(this)}
									/>
								</Col>
							</Row>
						</TabPane>
						<TabPane
							tab={
								<React.Fragment>
									<Icon type="login" />
									Login
								</React.Fragment>
							}
							key={2}>
							<Row type="flex" justify="center">
								<Col lg={12}>
									<LoginForm
										{...this.props}
										onFinish={this.onClose.bind(this)}
									/>
								</Col>
							</Row>
						</TabPane>
					</Tabs>
				</Drawer>
			</div>
		);
	}
}

export default SignupDrawer;
