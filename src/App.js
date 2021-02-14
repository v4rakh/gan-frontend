import React, { useEffect } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import { alertActions } from './actions/alertActions';
import AdminAnnouncementPage from './components/pages/AdminAnnouncementPage';
import LoginPage from './components/pages/LoginPage';
import { routesConstants } from './constants/routesConstants';
import { browserHistory } from './helpers/history';
import IndexPage from './components/pages/IndexPage';
import { Alert, Container } from 'react-bootstrap';
import { appConstants } from './constants/appConstants';
import AnnouncementsPage from './components/pages/AnnouncementsPage';
import AdminSubscriptionsPage from './components/pages/AdminSubscriptionPage';
import SubscriptionCreatePage from './components/pages/SubscriptionCreatePage';
import SubscriptionRescuePage from './components/pages/SubscriptionRescuePage';
import SubscriptionDeletePage from './components/pages/SubscriptionDeletePage';
import SubscriptionVerifyPage from './components/pages/SubscriptionVerifyPage';

function App() {
	const alert = useSelector((state) => state.alert);
	const dispatch = useDispatch();

	useEffect(() => {
		browserHistory.listen(() => {
			dispatch(alertActions.clear());
		});
	}, [dispatch]);

	if (appConstants.TITLE) {
		document.title = appConstants.TITLE;
	}

	return (
		<Router history={browserHistory}>
			<NavBar />
			<Container className="containerWrapper">
				{alert.message && <Alert variant={alert.type}>{alert.message}</Alert>}
				<Switch>
					<PrivateRoute exact path={routesConstants.ADMIN_ANNOUNCEMENTS} component={AdminAnnouncementPage} />
					<PrivateRoute exact path={routesConstants.ADMIN_SUBSCRIPTIONS} component={AdminSubscriptionsPage} />
					<Route exact path={routesConstants.ANNOUNCEMENTS} component={AnnouncementsPage} />
					<Route exact path={routesConstants.SUBSCRIPTION_CREATE} component={SubscriptionCreatePage} />
					<Route exact path={routesConstants.SUBSCRIPTION_VERIFY} component={SubscriptionVerifyPage} />
					<Route exact path={routesConstants.SUBSCRIPTION_RESCUE} component={SubscriptionRescuePage} />
					<Route exact path={routesConstants.SUBSCRIPTION_DELETE} component={SubscriptionDeletePage} />
					<Route exact path={routesConstants.LOGIN} component={LoginPage} />
					<Route exact path={routesConstants.INDEX} component={IndexPage} />
					<Redirect from="*" to={routesConstants.INDEX} />
				</Switch>
			</Container>
		</Router>
	);
}

export default App;
