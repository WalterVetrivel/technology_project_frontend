import React, {Component} from 'react';
import {Row, Col, Spin, Skeleton, Icon} from 'antd';
import axios from 'axios';

class UserAbout extends Component {
	state = {
		user: null,
		loading: true
	};

	async componentDidMount() {
		const requestQuery = `{
			user(id: "${this.props.userId}") {
				bio
				email
				dateOfBirth
			}
		}`;
		try {
			const result = await axios({
				method: 'POST',
				url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
				data: {
					query: requestQuery
				}
			});
			this.setState({user: result.data.data.user, loading: false});
		} catch (err) {
			console.log(err);
		}
	}

	getAge = dateOfBirth => {
		const now = new Date();
		const dob = new Date(dateOfBirth);
		const age = now.getFullYear() - dob.getFullYear();
		const monthDiff = now.getMonth() - dob.getMonth();
		return monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())
			? age - 1
			: age;
	};

	render() {
		return (
			<Spin spinning={this.state.loading}>
				<Row type="flex" justify="center">
					<Col sm={20}>
						{!this.state.loading ? (
							<Row>
								<Col md={12}>
									<h2>Bio</h2>
									{this.state.user.bio
										? this.state.user.bio
										: 'Nothing to show'}
								</Col>
								<Col md={8}>
									<h2>Contact and basic information</h2>
									<p>
										<Icon type="mail" />
										&nbsp;{this.state.user.email}
									</p>
									<p>
										<Icon type="calendar" />
										&nbsp;{this.getAge(this.state.user.dateOfBirth)} y. o.
									</p>
								</Col>
							</Row>
						) : (
							<Skeleton active />
						)}
					</Col>
				</Row>
			</Spin>
		);
	}
}

export default UserAbout;
