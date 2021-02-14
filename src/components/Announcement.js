import { Card } from 'react-bootstrap';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function Announcement({ announcement }) {
	const [t] = useTranslation();
	const { id, title, content, createdAt } = announcement;
	const date = new Date(createdAt);

	return (
		<Card key={id}>
			<Card.Header>{title}</Card.Header>
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
