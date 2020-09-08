import { authHeader } from '../helpers/authHeader';
import { apiConstants } from '../constants/apiConstants';
import axios from 'axios';
import { userService } from './userService';

export const announcementService = {
	getAll,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
};

function getAll(sortBy, sortOrder) {
	const options = {
		headers: { ...apiConstants.HEADERS, ...authHeader() },
		data: {},
	};

	let queryParameters = [];

	if (sortBy != null) {
		queryParameters.push(`sortBy=${sortBy}`);
	}
	if (sortOrder != null) {
		queryParameters.push(`sortOrder=${sortOrder}`);
	}

	return axios
		.get(
			`${apiConstants.URL}/api/announcements${queryParameters.length > 0 ? '?' + queryParameters.join('&') : ''}`,
			options
		)
		.then(handleResponse);
}

function createAnnouncement(title, content) {
	const options = {
		headers: { ...apiConstants.HEADERS, ...authHeader() },
		data: {},
	};

	return axios.post(`${apiConstants.URL}/api/admin/announcements`, { title, content }, options).then(handleResponse);
}

function updateAnnouncement(id, title, content) {
	const options = {
		headers: { ...apiConstants.HEADERS, ...authHeader() },
		data: {},
	};

	return axios.put(`${apiConstants.URL}/api/admin/announcements`, { id, title, content }, options).then(handleResponse);
}

function deleteAnnouncement(id) {
	const options = {
		headers: { ...apiConstants.HEADERS, ...authHeader() },
		data: {},
	};
	return axios.delete(`${apiConstants.URL}/api/admin/announcements/${id}`, options).then(handleResponse);
}

function handleResponse(response) {
	if (response.status !== 200 && response.status !== 204) {
		if (response.status === 401) {
			userService.logout();
			window.location.reload(true);
		}

		const error = (response.data && response.data.message) || response.statusText;
		return Promise.reject(error);
	}

	if (response.data) {
		return response.data;
	}

	return null;
}