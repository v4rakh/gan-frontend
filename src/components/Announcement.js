import { Card } from 'react-bootstrap';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { routesConstants } from '../constants/routesConstants';
import { generatePath, NavLink } from 'react-router-dom';

function Announcement({ announcement }) {
    const [t] = useTranslation();
    const { id, title, content, createdAt } = announcement;
    const date = new Date(createdAt);

    return (
        <Card key={id}>
            <Card.Header>
                <NavLink to={generatePath(routesConstants.ANNOUNCEMENT_DETAIL, { id })}>{title}</NavLink>
            </Card.Header>
            <Card.Body>
                <p className="card-text">{content}</p>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted text-center">
                    {t('page.announcements.time_local', {
                        universal: date.toUTCString(),
                        local: date.toLocaleString(),
                    })}
                </small>
            </Card.Footer>
        </Card>
    );
}

Announcement.propTypes = {
    announcement: PropTypes.object.isRequired,
};

export default Announcement;
