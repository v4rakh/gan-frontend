import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { paginationConstants } from '../../constants/paginationConstants';
import { announcementService } from '../../services/announcementService';
import LoadingSpinner from '../LoadingSpinner';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../actions/alertActions';
import { extractApiErrorMessage } from '../../helpers/api';

function AnnouncementsPage() {
	const dispatch = useDispatch();
	const [t] = useTranslation();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const fetchIdRef = useRef(0);

	useEffect(
		() => {
			fetchData({});
		},
		// eslint-disable-next-line
		[]
	);

	const fetchData = useCallback(
		({ sortBy }) => {
			const fetchId = ++fetchIdRef.current;
			setLoading(true);

			const sortByElement = Array.isArray(sortBy) && _.first(sortBy) ? _.first(sortBy) : null;
			const sortByElementId = sortByElement ? sortByElement.id : null;
			const sortByElementOrder = sortByElement
				? sortByElement.desc
					? paginationConstants.SORT_ORDER_DESC
					: paginationConstants.SORT_ORDER_ASC
				: null;

			if (fetchId === fetchIdRef.current) {
				announcementService
					.getAll(sortByElementId, sortByElementOrder)
					.then((data) => {
						setData(data?.data || []);
						setLoading(false);
					})
					.catch((error) => {
						setLoading(false);
						dispatch(alertActions.error(extractApiErrorMessage(error.response)));
					});
			}
		},
		[dispatch]
	);

	if (loading) {
		return <LoadingSpinner />;
	} else {
		return data && data.length > 0 ? (
			data.map((announcement) => (
				<React.Fragment key={`fragment_${announcement.id}`}>
					<Card key={announcement.id}>
						<Card.Header>{announcement.title}</Card.Header>
						<Card.Body>
							<p className="card-text">{announcement.content}</p>
						</Card.Body>
						<Card.Footer>
							<small className="text-muted text-center">{announcement.createdAt}</small>
						</Card.Footer>
					</Card>
					<br />
				</React.Fragment>
			))
		) : (
			<div>
				<p className="text-muted text-center">{t('page.announcements.no_data')}</p>
			</div>
		);
	}
}

export default AnnouncementsPage;
