import { alertActions } from './alertActions';
import { userService } from '../services/userService';
import { userConstants } from '../constants/userConstants';
import { routesConstants } from '../constants/routesConstants';
import { browserHistory } from '../helpers/history';
import i18n from '../translations/i18n';
import { extractApiErrorMessage } from '../helpers/api';

export const userActions = {
	login,
	logout,
	register,
};

function login(username, password) {
	return (dispatch) => {
		dispatch(request({ username }));

		userService.login(username, password).then(
			(user) => {
				dispatch(success(user));
				browserHistory.push(routesConstants.INDEX);
			},
			(error) => {
				dispatch(failure(error.toString()));
				dispatch(alertActions.error(extractApiErrorMessage(error.response)));
			}
		);
	};

	function request(user) {
		return { type: userConstants.LOGIN_REQUEST, user };
	}
	function success(user) {
		return { type: userConstants.LOGIN_SUCCESS, user };
	}
	function failure(error) {
		return { type: userConstants.LOGIN_FAILURE, error };
	}
}

function logout() {
	return (dispatch) => {
		userService.logout();
		dispatch(success());
	};

	function success() {
		return { type: userConstants.LOGOUT };
	}
}

function register(user) {
	return (dispatch) => {
		dispatch(request(user));

		userService.register(user).then(
			() => {
				dispatch(success());
				browserHistory.push(routesConstants.LOGIN);
				dispatch(alertActions.success(i18n.t('actions.register.success')));
			},
			(error) => {
				dispatch(alertActions.error(extractApiErrorMessage(error.response)));
				dispatch(failure(error.toString()));
			}
		);
	};

	function request(user) {
		return { type: userConstants.REGISTER_REQUEST, user };
	}
	function success(user) {
		return { type: userConstants.REGISTER_SUCCESS, user };
	}
	function failure(error) {
		return { type: userConstants.REGISTER_FAILURE, error };
	}
}

export default userActions;
