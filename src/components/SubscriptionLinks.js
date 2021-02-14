import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { routesConstants } from '../constants/routesConstants';
import React from 'react';
import PropTypes from 'prop-types';

function SubscriptionLinks({ showCreate, showDelete, showRescue, showVerify }) {
	const [t] = useTranslation();

	return (
		<div className="col-6 col-sm-6">
			{showCreate && (
				<>
					<small className="text-muted text-center float-right">
						<NavLink to={routesConstants.SUBSCRIPTION_CREATE}>{t('page.subscription_link.create')}</NavLink>
					</small>
					<br />
				</>
			)}
			{showVerify && (
				<>
					<small className="text-muted text-center float-right">
						<NavLink to={routesConstants.SUBSCRIPTION_VERIFY}>{t('page.subscription_link.verify')}</NavLink>
					</small>
					<br />
				</>
			)}
			{showRescue && (
				<>
					<small className="text-muted text-center float-right">
						<NavLink to={routesConstants.SUBSCRIPTION_RESCUE}>{t('page.subscription_link.rescue')}</NavLink>
					</small>
					<br />
				</>
			)}
			{showDelete && (
				<small className="text-muted text-center float-right">
					<Link className="text-danger" to={routesConstants.SUBSCRIPTION_DELETE}>
						{t('page.subscription_link.delete')}
					</Link>
				</small>
			)}
		</div>
	);
}

SubscriptionLinks.defaultProps = {
	showCreate: true,
	showVerify: true,
	showRescue: true,
	showDelete: true,
};

SubscriptionLinks.propTypes = {
	showCreate: PropTypes.bool,
	showVerify: PropTypes.bool,
	showRescue: PropTypes.bool,
	showDelete: PropTypes.bool,
};

export default SubscriptionLinks;
