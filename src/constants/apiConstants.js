export const apiConstants = {
    URL: (window && window._env_ && window._env_.REACT_APP_API_URL) || process.env.REACT_APP_API_URL,
    HEADERS: {
        'content-type': 'application/json;charset=UTF-8',
    },
};
