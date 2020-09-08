import { localStorageConstants } from '../constants/localStorageConstants';
import { apiConstants } from '../constants/apiConstants';
import axios from 'axios';

export const userService = {
	login,
	logout,
};

function login(username, password) {
	const options = {
		headers: { ...apiConstants.HEADERS, ...{ Authorization: 'Basic ' + window.btoa(`${username}:${password}`) } },
	};

	return axios
		.get(`${apiConstants.URL}/api/admin/login`, options)
		.then(handleResponse)
		.then(() => {
			const user = { username: username, password: password };
			localStorage.setItem(localStorageConstants.SESSION, JSON.stringify(user));
			return user;
		});
}

function logout() {
	localStorage.removeItem(localStorageConstants.SESSION);
}

function handleResponse(response) {
	if (response.status !== 200 && response.status !== 204) {
		if (response.status === 401) {
			logout();
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
