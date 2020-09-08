import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBarItem({ hideOnAuth, requiresAuth, requiresAdmin, route, label, callback }) {
	const auth = useSelector((state) => state.authentication.user);
	let isAdmin = auth != null;

	if ((requiresAuth && !auth) || (hideOnAuth && auth) || (requiresAdmin && !isAdmin)) {
		return <div />;
	}

	return (
		<NavLink as={Link} href={route} to={route} onClick={callback}>
			{label}
		</NavLink>
	);
}

NavBarItem.propTypes = {
	label: PropTypes.string.isRequired,
	route: PropTypes.string.isRequired,
	requiresAuth: PropTypes.bool,
	requiresAdmin: PropTypes.bool,
	hideOnAuth: PropTypes.bool,
	callback: PropTypes.func,
};

NavBarItem.defaultProps = {
	requiresAuth: false,
	requiresAdmin: false,
	hideOnAuth: false,
	callback: _.noop(),
};

export default NavBarItem;
