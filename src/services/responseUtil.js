import { userService } from './userService';

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

export default handleResponse;
