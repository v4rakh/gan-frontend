import React from 'react';
import NavBarItem from './NavBarItem';
import { useTranslation } from 'react-i18next';
import { routesConstants } from '../constants/routesConstants';
import { useDispatch } from 'react-redux';
import userActions from '../actions/userActions';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { appConstants } from '../constants/appConstants';
import { Link } from 'react-router-dom';

function NavBar() {
	const [t] = useTranslation();
	const dispatch = useDispatch();

	return (
		<Navbar bg="dark" variant="dark" expand="lg" fixed="top">
			<Container>
				<Navbar.Brand href={routesConstants.INDEX} as={Link} to={routesConstants.INDEX}>
					{appConstants.TITLE ? appConstants.TITLE : t('navbar.header')}
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />

				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<NavBarItem route={routesConstants.INDEX} label={t('navbar.home')} />
						<NavBarItem route={routesConstants.LOGIN} label={t('navbar.login')} hideOnAuth={true} />
						<NavBarItem
							route={routesConstants.ADMIN_ANNOUNCEMENTS}
							label={t('navbar.admin_announcements')}
							requiresAuth={true}
							requiresAdmin={true}
						/>
						<NavBarItem
							route={routesConstants.LOGOUT}
							label={t('navbar.logout')}
							requiresAuth={true}
							callback={() => {
								dispatch(userActions.logout());
							}}
						/>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavBar;
