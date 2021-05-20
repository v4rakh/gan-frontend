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

function SubscriptionRescuePage() {
    const [t] = useTranslation();
    const dispatch = useDispatch();

    const [inputs, setInputs] = useState({
        address: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const { address } = inputs;
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((inputs) => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (address) {
            setLoading(true);
            subscriptionService
                .rescueSubscription(address)
                .then(() => {
                    setLoading(false);
                    browserHistory.push(routesConstants.INDEX);
                    dispatch(alertActions.success(t('page.subscription_rescue.form.success', { address: address })));
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
                        <Card.Header>{t('page.subscription_rescue.form.title')}</Card.Header>
                        <Card.Body className="card-body">
                            <Form name="form" onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>{t('page.subscription_rescue.form.address')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={address}
                                        onChange={handleChange}
                                        className={'form-control' + (submitted && !address ? ' is-invalid' : '')}
                                    />
                                    {submitted && !address && (
                                        <div className="invalid-feedback">
                                            {t('page.subscription_rescue.form.address_hint')}
                                        </div>
                                    )}
                                </Form.Group>
                                <Form.Group>
                                    <div className="row">
                                        <div className="col-6 col-sm-6">
                                            <Button type="submit" className="float-left">
                                                {loading && <LoadingSpinner />}
                                                {t('page.subscription_rescue.form.button_title')}
                                            </Button>
                                        </div>
                                        <SubscriptionLinks showRescue={false} />
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

export default SubscriptionRescuePage;
