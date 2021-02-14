import React, { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { paginationConstants } from '../../constants/paginationConstants';
import { announcementService } from '../../services/announcementService';
import LoadingSpinner from '../LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { alertActions } from '../../actions/alertActions';
import { extractApiErrorMessage } from '../../helpers/api';
import Announcement from '../Announcement';
import { Link } from 'react-router-dom';
import { routesConstants } from '../../constants/routesConstants';

function AnnouncementsPage() {
	const dispatch = useDispatch();
	const [t] = useTranslation();
	const [data, setData] = useState([]);
	const [page, setPage] = useState(paginationConstants.DEFAULT_PAGE);
	const [pageCount, setPageCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const fetchIdRef = useRef(0);

	useEffect(
		() => {
			fetchData({ page, pageCount, sortBy: 'createdAt' });
		},
		// eslint-disable-next-line
		[page]
	);

	const fetchData = useCallback(
		({ sortBy, page }) => {
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
					.getAll(sortByElementId, sortByElementOrder, page, paginationConstants.DEFAULT_PAGE_SIZE)
					.then((data) => {
						setData(data?.data.content || []);
						setPageCount(data?.data?.totalPages || 0);
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

	const canNextPage = () => {
		return page + 1 < pageCount;
	};

	const nextPage = () => {
		if (canNextPage()) {
			setPage(page + 1);
		}
	};

	const canPreviousPage = () => {
		return page > 0;
	};

	const previousPage = () => {
		if (canPreviousPage()) {
			setPage(page - 1);
		}
	};

	const gotoPage = (page) => {
		setPage(page);
	};

	if (loading) {
		return <LoadingSpinner />;
	} else {
		return data && data.length > 0 ? (
			<div>
				<div className="float-right">
					<small className="text-muted text-center">
						<Link to={routesConstants.SUBSCRIPTION_CREATE}>{t('page.announcements.subscribe')}</Link>
					</small>
				</div>
				<br />
				{data.map((announcement) => (
					<React.Fragment key={`fragment_${announcement.id}`}>
						<Announcement announcement={announcement} />
						<br />
					</React.Fragment>
				))}
				<div>
					<nav>
						<ul className="pagination">
							<li className={canPreviousPage() ? 'page-item' : 'page-item disabled'}>
								<button
									className="page-link"
									aria-label={t('pagination.first')}
									onClick={() => gotoPage(0)}
									disabled={!canPreviousPage()}>
									<span aria-hidden="true">&laquo;</span>
									<span className="sr-only">{t('pagination.first')}</span>
								</button>
							</li>
							<li className={canPreviousPage() ? 'page-item' : 'page-item disabled'}>
								<button
									className="page-link"
									aria-label={t('pagination.previous')}
									onClick={() => previousPage()}
									disabled={!canPreviousPage()}>
									<span aria-hidden="true">&lsaquo;</span>
									<span className="sr-only">{t('pagination.previous')}</span>
								</button>
							</li>
							<li className={canNextPage() ? 'page-item' : 'page-item disabled'}>
								<button
									className="page-link"
									aria-label={t('pagination.next')}
									onClick={() => nextPage()}
									disabled={!canNextPage()}>
									<span aria-hidden="true">&rsaquo;</span>
									<span className="sr-only">{t('pagination.next')}</span>
								</button>
							</li>
							<li className={canNextPage() ? 'page-item' : 'page-item disabled'}>
								<button
									className="page-link"
									aria-label={t('pagination.last')}
									onClick={() => gotoPage(pageCount - 1)}
									disabled={!canNextPage()}>
									<span aria-hidden="true">&raquo;</span>
									<span className="sr-only">{t('pagination.last')}</span>
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		) : (
			<div>
				<p className="text-muted text-center">{t('page.announcements.no_data')}</p>
			</div>
		);
	}
}

export default AnnouncementsPage;
