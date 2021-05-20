import React from 'react';
import { routesConstants } from '../../constants/routesConstants';
import { Redirect } from 'react-router-dom';

function IndexPage() {
    return <Redirect to={routesConstants.ANNOUNCEMENTS} />;
}

export default IndexPage;
