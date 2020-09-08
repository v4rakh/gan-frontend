export const appConstants = {
	TITLE: window._env_.APP_TITLE,
	PRODUCTION: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
};
