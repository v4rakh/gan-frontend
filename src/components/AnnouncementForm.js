import { Button, Form } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { announcementService } from '../services/announcementService';
import { extractApiErrorMessage } from '../helpers/api';

function AnnouncementForm({ id, titleInput = '', contentInput = '', postSubmitSuccessCallback = null }) {
	const [t] = useTranslation();
	const [inputs, setInputs] = useState({
		title: titleInput,
		content: contentInput,
	});
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setErr] = useState(null);
	const { title, content } = inputs;

	function handleChange(e) {
		const { name, value } = e.target;
		setInputs((inputs) => ({ ...inputs, [name]: value }));
	}

	function handleSubmit(e) {
		e.preventDefault();

		setSubmitted(true);
		setSubmitting(true);

		if (!id) {
			announcementService
				.createAnnouncement(title, content)
				.then(() => {
					setSubmitted(false);
					setSubmitting(false);

					if (postSubmitSuccessCallback != null) {
						postSubmitSuccessCallback();
					}
				})
				.catch((e) => {
					setSubmitting(false);
					setErr(e);
				});
		} else {
			announcementService
				.updateAnnouncement(id, title, content)
				.then(() => {
					setSubmitted(false);
					setSubmitting(false);

					if (postSubmitSuccessCallback != null) {
						postSubmitSuccessCallback();
					}
				})
				.catch((e) => {
					setErr(e);
					setSubmitting(false);
				});
		}
	}

	return (
		<React.Fragment>
			<Form name="form" onSubmit={handleSubmit}>
				<Form.Group>
					{submitted && error && <span className="red">{extractApiErrorMessage(error.response)}</span>}
				</Form.Group>

				<Form.Group>
					<Form.Label>{t('page.admin_announcements.form.title')}</Form.Label>
					<Form.Control
						type="text"
						name="title"
						value={title}
						onChange={handleChange}
						className={
							'form-control' + (submitted && (!title || title === '' || title.length <= 3) ? ' is-invalid' : '')
						}
					/>
					{submitted && (!title || title === '' || title.length <= 3) && (
						<div className="invalid-feedback">{t('page.admin_announcements.validation.title')}</div>
					)}
				</Form.Group>
				<Form.Group>
					<Form.Label>{t('page.admin_announcements.form.content')}</Form.Label>
					<Form.Control
						as="textarea"
						rows="3"
						type="text"
						name="content"
						value={content}
						onChange={handleChange}
						className={'form-control' + (submitted && (!content || content === '') ? ' is-invalid' : '')}
					/>
					{submitted && (!content || content === '') && (
						<div className="invalid-feedback">{t('page.admin_announcements.validation.content')}</div>
					)}
				</Form.Group>
				<Form.Group>
					<Button type="submit">
						{submitting && <LoadingSpinner />}
						{t('page.admin_announcements.form.submit')}
					</Button>
				</Form.Group>
			</Form>
		</React.Fragment>
	);
}

AnnouncementForm.propTypes = {
	id: PropTypes.string,
	titleInput: PropTypes.string,
	contentInput: PropTypes.string,
	postSubmitSuccessCallback: PropTypes.func,
};

export default AnnouncementForm;
