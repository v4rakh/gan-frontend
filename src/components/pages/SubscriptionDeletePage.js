import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../LoadingSpinner';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { alertActions } from '../../actions/alertActions';
import { extractApiErrorMessage } from '../../helpers/api';
import { subscriptionService } from '../../services/subscriptionService';
import { useDispatch } from 'react-redux';
import { browserHistory } from '../../helpers/history';
import { routesConstants } from '../../constants/routesConstants';
import SubscriptionLinks from '../SubscriptionLinks';
import { webHelper } from '../../helpers/webHelper';

function SubscriptionDeletePage() {
    const [t] = useTranslation();
    const dispatch = useDispatch();

    const [inputs, setInputs] = useState({
        address: webHelper.getQueryParameter('address') || '',
        token: webHelper.getQueryParameter('token') || '',
    });
    const [submitted, setSubmitted] = useState(false);
    const { address, token } = inputs;
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((inputs) => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (address && token) {
            setLoading(true);
            subscriptionService
                .deleteSubscription(address, token)
                .then(() => {
                    setLoading(false);
                    browserHistory.push(routesConstants.SUBSCRIPTION_CREATE);
                    dispatch(
                        alertActions.success(
                            t('page.subscription_delete.form.success', {
                                address: address,
                                token: token,
                            })
                        )
                    );
                })
                .catch((error) => {
                    setLoading(false);
                    dispatch(alertActions.error(extractApiErrorMessage(error.response)));
                });
        }
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Header>{t('page.subscription_delete.form.title')}</Card.Header>
                        <Card.Body className="card-body">
                            <Form name="form" onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>{t('page.subscription_delete.form.address')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={address}
                                        onChange={handleChange}
                                        className={'form-control' + (submitted && !address ? ' is-invalid' : '')}
                                    />
                                    {submitted && !address && (
                                        <div className="invalid-feedback">
                                            {t('page.subscription_delete.form.address_hint')}
                                        </div>
                                    )}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>{t('page.subscription_delete.form.token')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="token"
                                        value={token}
                                        onChange={handleChange}
                                        className={'form-control' + (submitted && !token ? ' is-invalid' : '')}
                                    />
                                    {submitted && !token && (
                                        <div className="invalid-feedback">
                                            {t('page.subscription_delete.form.token_hint')}
                                        </div>
                                    )}
                                </Form.Group>
                                <Form.Group>
                                    <div className="row">
                                        <div className="col-6 col-sm-6">
                                            <Button variant="danger" type="submit" className="float-left">
                                                {loading && <LoadingSpinner />}
                                                {t('page.subscription_delete.form.button_title')}
                                            </Button>
                                        </div>
                                        <SubscriptionLinks showDelete={false} />
                                    </div>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SubscriptionDeletePage;
