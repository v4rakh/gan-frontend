import i18n from '../translations/i18n';
import { userService } from '../services/userService';

const ERROR_BAD_REQUEST = 'BadRequest';
const ERROR_NOT_FOUND = 'NotFound';
const ERROR_CONFLICT = 'Conflict';
const ERROR_GENERAL = 'GeneralError';

export const extractApiErrorMessage = (response) => {
    let msg = i18n.t('actions.unknown_error');

    if (response?.data?.message) {
        return response.data.message;
    }

    if (response?.data?.status === ERROR_BAD_REQUEST) {
        return i18n.t('actions.bad_request');
    }

    if (response?.data?.status === ERROR_NOT_FOUND) {
        return i18n.t('actions.not_found');
    }

    if (response?.data?.status === ERROR_CONFLICT) {
        return i18n.t('actions.conflict');
    }

    if (response?.data?.status === ERROR_GENERAL) {
        return i18n.t('actions.general_error');
    }

    return msg;
};

export const checkAuthAfterDeserialize = (username, password) => {
    async function check(username, password) {
        try {
            return await userService
                .login(username, password)
                .then(() => {
                    return true;
                })
                .catch(() => {
                    return null;
                });
        } catch (error) {
            console.error('Could not deserialize after reload');
        }
    }

    return check(username, password);
};
