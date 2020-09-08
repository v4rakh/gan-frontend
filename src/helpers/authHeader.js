import { localStorageConstants } from '../constants/localStorageConstants';

export function authHeader() {
	let user = JSON.parse(localStorage.getItem(localStorageConstants.SESSION));
	if (user && user.username && user.password) {
		return { Authorization: 'Basic ' + window.btoa(`${user.username}:${user.password}`) };
	} else {
		return {};
	}
}
