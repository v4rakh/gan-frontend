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
import { announcementService } from '../../services/announcementService';
import AnnouncementForm from '../AnnouncementForm';

function AdminAnnouncementPage() {
	const dispatch = useDispatch();
	const [t] = useTranslation();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const fetchIdRef = useRef(0);

	const [showCreateModal, hideCreateModal] = useModal(() => {
		return (
			<Modal show={true} onHide={hideCreateModal} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{t('page.admin_announcements.create.title')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AnnouncementForm
						postSubmitSuccessCallback={() => {
							hideCreateModal();
							fetchData({});
						}}
					/>
				</Modal.Body>
			</Modal>
		);
	}, []);

	const [updateModalData, setUpdateModalData] = useState(null);
	const [showUpdateModal, hideUpdateModal] = useModal(() => {
		return (
			<Modal show={true} onHide={hideUpdateModal} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{t('page.admin_announcements.update.title')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AnnouncementForm
						id={updateModalData.id}
						titleInput={updateModalData.title}
						contentInput={updateModalData.content}
						postSubmitSuccessCallback={() => {
							hideUpdateModal();
							fetchData({});
						}}
					/>
				</Modal.Body>
			</Modal>
		);
	}, [updateModalData]);

	const [deleteModalData, setDeleteModalData] = useState(null);
	const [showDeleteModal, hideDeleteModal] = useModal(() => {
		return (
			<Modal show={true} onHide={hideDeleteModal} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{t('page.admin_announcements.delete_confirm.title')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{t('page.admin_announcements.delete_confirm.description', {
						name: deleteModalData.title,
					})}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={() => {
							hideDeleteModal();
							announcementService
								.deleteAnnouncement(deleteModalData.id)
								.then(() => {
									fetchData({});
								})
								.catch(() => {
									dispatch(alertActions.error(t('actions.could_not_execute_api_call')));
								});
						}}>
						{t('misc.ok_button')}
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}, [deleteModalData]);

	const openUpdateModal = useCallback(
		(data) => {
			setUpdateModalData(data);
			showUpdateModal();
		},
		[setUpdateModalData, showUpdateModal]
	);

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
				Header: t('page.admin_announcements.title'),
				accessor: 'title',
			},
			{
				Header: t('page.admin_announcements.createdAt'),
				accessor: (row) => new Date(row.createdAt).toLocaleString(),
			},
			{
				Header: t('page.admin_announcements.actions'),
				// eslint-disable-next-line react/display-name
				Cell: (row) => (
					<React.Fragment>
						<Button
							variant="outline-info"
							onClick={() => {
								openUpdateModal(row.row.original);
							}}>
							{t('page.admin_announcements.update_action')}
						</Button>
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
		[openUpdateModal, openDeleteModal, t]
	);

	const fetchData = useCallback(({ sortBy }) => {
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
					setPageCount(0);
					setLoading(false);
				})
				.catch(() => {
					setLoading(false);
				});
		}
	}, []);

	return (
		<Container>
			<Button
				onClick={() => {
					showCreateModal();
				}}>
				{t('page.admin_announcements.create_btn')}
			</Button>
			<br />
			<br />
			<Table
				columns={columns}
				data={data}
				loading={loading}
				fetchData={fetchData}
				pageCount={pageCount}
				withPagination={false}
			/>
		</Container>
	);
}

export default AdminAnnouncementPage;
