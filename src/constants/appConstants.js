export const appConstants = {
	TITLE: (window && window._env_ && window._env_.REACT_APP_APP_TITLE) || process.env.REACT_APP_APP_TITLE,
	PRODUCTION: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
};
