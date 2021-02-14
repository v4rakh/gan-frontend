import { authHeader } from '../helpers/authHeader';
import { apiConstants } from '../constants/apiConstants';
import axios from 'axios';
import handleResponse from './responseUtil';

export const subscriptionService = {
	getAll,
	createSubscription,
	verifySubscription,
	rescueSubscription,
	deleteSubscription,
	deleteSubscriptionByAddress,
};

function getAll(orderBy, order, page, pageSize) {
	const options = {
		headers: { ...apiConstants.HEADERS, ...authHeader() },
		data: {},
	};

	let queryParameters = [];

	if (orderBy != null) {
		queryParameters.push(`orderBy=${orderBy}`);
	}
	if (order != null) {
		queryParameters.push(`order=${order}`);
	}
	if (page != null) {
		queryParameters.push(`page=${page}`);
	}
	if (pageSize != null) {
		queryParameters.push(`pageSize=${pageSize}`);
	}

	return axios
		.get(
			`${apiConstants.URL}/api/v1/admin/subscriptions${
				queryParameters.length > 0 ? '?' + queryParameters.join('&') : ''
			}`,
			options
		)
		.then(handleResponse);
}

function deleteSubscriptionByAddress(address) {
	const options = {
		headers: { ...apiConstants.HEADERS, ...authHeader() },
		data: { address },
	};
	return axios.delete(`${apiConstants.URL}/api/v1/admin/subscriptions`, options).then(handleResponse);
}

function createSubscription(address) {
	const options = {
		headers: { ...apiConstants.HEADERS },
		data: {},
	};

	return axios.post(`${apiConstants.URL}/api/v1/subscriptions`, { address }, options).then(handleResponse);
}

function rescueSubscription(address) {
	const options = {
		headers: { ...apiConstants.HEADERS },
		data: {},
	};

	return axios.post(`${apiConstants.URL}/api/v1/subscriptions/rescue`, { address }, options).then(handleResponse);
}

function verifySubscription(address, token) {
	const options = {
		headers: { ...apiConstants.HEADERS },
		data: {},
	};

	return axios.patch(`${apiConstants.URL}/api/v1/subscriptions`, { address, token }, options).then(handleResponse);
}

function deleteSubscription(address, token) {
	const options = {
		headers: { ...apiConstants.HEADERS },
		data: { address, token },
	};
	return axios.delete(`${apiConstants.URL}/api/v1/subscriptions`, options).then(handleResponse);
}
