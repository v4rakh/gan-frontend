import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { localStorageConstants } from '../constants/localStorageConstants';
import { routesConstants } from '../constants/routesConstants';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			localStorage.getItem(localStorageConstants.SESSION) ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: routesConstants.LOGIN,
						state: { from: props.location },
					}}
				/>
			)
		}
	/>
);

PrivateRoute.propTypes = {
	component: PropTypes.any.isRequired,
	location: PropTypes.object,
};

export default PrivateRoute;
