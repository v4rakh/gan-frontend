import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Table from '../Table';
import { alertActions } from '../../actions/alertActions';
import { Button, Container } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import _ from 'lodash';
import { useModal } from 'react-modal-hook';
import { paginationConstants } from '../../constants/paginationConstants';
import { subscriptionService } from '../../services/subscriptionService';
import { extractApiErrorMessage } from '../../helpers/api';

function AdminSubscriptionPage() {
	const dispatch = useDispatch();
	const [t] = useTranslation();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const fetchIdRef = useRef(0);

	const [deleteModalData, setDeleteModalData] = useState(null);
	const [showDeleteModal, hideDeleteModal] = useModal(() => {
		return (
			<Modal show={true} onHide={hideDeleteModal} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{t('page.admin_subscriptions.delete_confirm.title')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{t('page.admin_subscriptions.delete_confirm.description', {
						address: deleteModalData.address,
					})}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={() => {
							hideDeleteModal();
							subscriptionService
								.deleteSubscriptionByAddress(deleteModalData.address)
								.then(() => {
									fetchData({ pageIndex: paginationConstants.DEFAULT_PAGE });
								})
								.catch((error) => {
									dispatch(alertActions.error(extractApiErrorMessage(error.response)));
								});
						}}>
						{t('misc.ok_button')}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}, [deleteModalData]);

	const openDeleteModal = useCallback(
		(data) => {
			setDeleteModalData(data);
			showDeleteModal();
		},
		[setDeleteModalData, showDeleteModal]
	);

	const columns = useMemo(
		() => [
			{
				Header: t('page.admin_subscriptions.address'),
				accessor: 'address',
			},
			{
				Header: t('page.admin_subscriptions.state'),
				accessor: 'state',
			},
			{
				Header: t('page.admin_subscriptions.token'),
				accessor: 'token',
			},
			{
				Header: t('page.admin_subscriptions.createdAt'),
				accessor: (row) => new Date(row.createdAt).toLocaleString(),
			},
			{
				Header: t('page.admin_subscriptions.updatedAt'),
				accessor: (row) => new Date(row.updatedAt).toLocaleString(),
			},
			{
				Header: t('page.admin_subscriptions.actions'),
				// eslint-disable-next-line react/display-name
				Cell: (row) => (
					<React.Fragment>
						<Button
							className="m-sm-1"
							variant="outline-danger"
							onClick={() => {
								openDeleteModal(row.row.original);
							}}>
							{t('page.admin_announcements.delete_action')}
						</Button>
					</React.Fragment>
				),
				sortable: false,
			},
		],
		[openDeleteModal, t]
	);

	const fetchData = useCallback(({ pageIndex, pageSize, sortBy }) => {
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
			subscriptionService
				.getAll(sortByElementId, sortByElementOrder, pageIndex, pageSize)
				.then((data) => {
					setData(data?.data?.content || []);
					setPageCount(data?.data?.totalPages || 0);
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					dispatch(alertActions.error(extractApiErrorMessage(error.response)));
				});
		}
	}, []);

	return (
		<Container>
			<Table
				columns={columns}
				data={data}
				loading={loading}
				fetchData={fetchData}
				pageCount={pageCount}
				initialPage={paginationConstants.DEFAULT_PAGE}
				withPagination={true}
			/>
		</Container>
	);
}

export default AdminSubscriptionPage;
