import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userActions from '../../actions/userActions';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../LoadingSpinner';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

function LoginPage() {
	const [t] = useTranslation();

	const [inputs, setInputs] = useState({
		username: '',
		password: '',
	});
	const [submitted, setSubmitted] = useState(false);
	const { username, password } = inputs;
	const loggingIn = useSelector((state) => state.authentication.loggingIn);
	const dispatch = useDispatch();

	// reset login status
	useEffect(() => {
		dispatch(userActions.logout());
	}, [dispatch]);

	function handleChange(e) {
		const { name, value } = e.target;
		setInputs((inputs) => ({ ...inputs, [name]: value }));
	}

	function handleSubmit(e) {
		e.preventDefault();

		setSubmitted(true);
		if (username && password) {
			dispatch(userActions.login(username, password));
		}
	}

	return (
		<Container>
			<Row className="justify-content-md-center">
				<Col md={6}>
					<Card>
						<Card.Header>{t('page.login.header')}</Card.Header>
						<Card.Body className="card-body">
							<Form name="form" onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Label>{t('page.login.form.username')}</Form.Label>
									<Form.Control
										type="text"
										name="username"
										value={username}
										onChange={handleChange}
										className={'form-control' + (submitted && !username ? ' is-invalid' : '')}
									/>
									{submitted && !username && (
										<div className="invalid-feedback">{t('page.login.validation.username')}</div>
									)}
								</Form.Group>
								<Form.Group>
									<Form.Label>{t('page.login.form.password')}</Form.Label>
									<Form.Control
										type="password"
										name="password"
										value={password}
										onChange={handleChange}
										className={'form-control' + (submitted && !password ? ' is-invalid' : '')}
									/>
									{submitted && !password && (
										<div className="invalid-feedback">{t('page.login.validation.password')}</div>
									)}
								</Form.Group>
								<Form.Group>
									<Button type="submit">
										{loggingIn && <LoadingSpinner />}
										{t('page.login.form.login')}
									</Button>
								</Form.Group>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default LoginPage;
