import React, { useCallback, useEffect, useRef, useState } from 'react';
import { announcementService } from '../../services/announcementService';
import LoadingSpinner from '../LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Announcement from '../Announcement';
import { webHelper } from '../../helpers/webHelper';

function AnnouncementPage() {
	const dispatch = useDispatch();
	const [t] = useTranslation();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const fetchIdRef = useRef(0);
	const id = webHelper.getPathParameter('id');

	useEffect(
		() => {
			fetchData({ id });
		},
		// eslint-disable-next-line
		[]
	);

	const fetchData = useCallback(
		({ id: announcementId }) => {
			const fetchId = ++fetchIdRef.current;
			setLoading(true);

			if (fetchId === fetchIdRef.current) {
				announcementService
					.getAnnouncement(announcementId)
					.then((data) => {
						setData(data?.data || null);
						setLoading(false);
					})
					.catch(() => {
						setLoading(false);
					});
			}
		},
		[id, dispatch]
	);

	if (loading) {
		return <LoadingSpinner />;
	} else {
		return data ? (
			<div>
				<Announcement announcement={data} />
			</div>
		) : (
			<div>
				<p className="text-muted text-center">{t('page.announcement.no_data', { id: id })}</p>
			</div>
		);
	}
}

export default AnnouncementPage;
