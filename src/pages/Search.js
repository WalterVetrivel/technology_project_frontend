import React from 'react';
import {Tabs} from 'antd';
import SearchResults from './SearchResults';
import UserSearchResults from './UserSearchResults';
import Navbar from '../components/Layout/Navbar';

const search = () => (
	<React.Fragment>
		<Navbar />
		<Tabs defaultActiveKey="1" animated>
			<Tabs.TabPane key="1" tab="Events">
				<SearchResults />
			</Tabs.TabPane>
			<Tabs.TabPane key="2" tab="Users">
				<UserSearchResults />
			</Tabs.TabPane>
		</Tabs>
	</React.Fragment>
);

export default search;
