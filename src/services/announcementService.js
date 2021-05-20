import { authHeader } from '../helpers/authHeader';
import { apiConstants } from '../constants/apiConstants';
import axios from 'axios';
import handleResponse from './responseUtil';

export const announcementService = {
    getAll,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
};

function getAll(orderBy, order, page, pageSize) {
    const options = {
        headers: { ...apiConstants.HEADERS },
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
            `${apiConstants.URL}/api/v1/announcements${
                queryParameters.length > 0 ? '?' + queryParameters.join('&') : ''
            }`,
            options
        )
        .then(handleResponse);
}

function getAnnouncement(id) {
    const options = {
        headers: { ...apiConstants.HEADERS },
        data: {},
    };

    return axios.get(`${apiConstants.URL}/api/v1/announcements/${id}`, options).then(handleResponse);
}

function createAnnouncement(title, content) {
    const options = {
        headers: { ...apiConstants.HEADERS, ...authHeader() },
        data: {},
    };

    return axios
        .post(
            `${apiConstants.URL}/api/v1/admin/announcements`,
            {
                title,
                content,
            },
            options
        )
        .then(handleResponse);
}

function updateAnnouncement(id, title, content) {
    const options = {
        headers: { ...apiConstants.HEADERS, ...authHeader() },
        data: {},
    };

    return axios
        .put(`${apiConstants.URL}/api/v1/admin/announcements`, { id, title, content }, options)
        .then(handleResponse);
}

function deleteAnnouncement(id) {
    const options = {
        headers: { ...apiConstants.HEADERS, ...authHeader() },
        data: {},
    };
    return axios.delete(`${apiConstants.URL}/api/v1/admin/announcements/${id}`, options).then(handleResponse);
}
