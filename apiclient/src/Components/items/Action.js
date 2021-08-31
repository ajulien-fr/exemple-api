import React from 'react'

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Compte from './Compte';
import Animal from './Animal';
import Intervenant from './Intervenant';

class Action extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOnDel = this.handleClickOnDel.bind(this);
        this.handleClickOnEdit = this.handleClickOnEdit.bind(this);
        this.handleClickOnCancel = this.handleClickOnCancel.bind(this);

        this.state = {
            edit: false,

            btnText: 'Éditer',

            id: this.props.action.id,
            type: this.props.action.type,
            date: this.props.action.date,
            montant: this.props.action.montant,
            remarque: this.props.action.remarque,
            compte: this.props.compte,

            animal: (typeof this.props.animal === 'undefined') ?
                undefined : this.props.animal,
            
            intervenant: (typeof this.props.intervenant === 'undefined') ?
                undefined : this.props.intervenant,
            
            idcompte: this.props.compte.id,
            
            idanimal: (typeof this.props.animal === 'undefined') ?
                undefined : this.props.animal.id,
            
            idintervenant: (typeof this.props.intervenant === 'undefined') ?
                undefined : this.props.intervenant.id,

            readonly: true
        };
    }

    handleClickOnDel(id) {
        const token = localStorage.getItem('token');

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var url = 'http://127.0.0.1:8000/api/actions/' + id;

        fetch(url, requestOptions)
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;

                    return Promise.reject(error);
                }

                return data;
            })
            .then(data => { this.props.getActions(); })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    handleClickOnEdit(id) { 
        if (this.state.edit === false) {
            this.setState({ edit: true, btnText: 'Sauvegarder', readonly: false });
        }

        else {
            const token = localStorage.getItem('token');

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    type: this.state.type,
                    date: this.state.date,
                    /* eslint no-eval: 0 */
                    montant: eval(this.state.montant),
                    remarque: this.state.remarque,
                    idcompte: this.state.idcompte,
                    idanimal: this.state.idanimal,
                    idintervenant: this.state.idintervenant
                })
            };

            var url = 'http://127.0.0.1:8000/api/actions/' + id;

            if (!this.checkMontant(this.state.montant)) {
                this.setError('montant invalide');

                return;
            }

            fetch(url, requestOptions)
                .then(async response => {
                    const data = await response.json();

                    if (!response.ok) {
                        const error = (data && data.message) || response.status;

                        return Promise.reject(error);
                    }

                    return data;
                })
                .then(data => {
                    this.props.getActions();

                    this.setState({ edit: false, btnText: 'Éditer', readonly: true })
                })
                .catch(error => {
                    if (error.message) this.setError(error.message);

                    else this.setError(error);
                });
        }
    }

    checkMontant(montant) {
        var valid = true;

        for (var i = 0; i < montant.length; i++) {
            var e = montant[i];

            if ((!(e >= 0 && e <= 9)) &&
                (!(e === '+' || e === '-' || e === '*' || e === '/' || e === ' ')))
            {
                valid = false;
            }
        }

        return valid;
    }

    handleClickOnCancel() {
        if (this.state.edit === true) {
            this.setState({ edit: false, btnText: 'Éditer', readonly: true });
        }
    }

    render() {
        return (
            <Tabs defaultActiveKey="action">
                <Tab title="Action" eventKey="action">
                    <div className="my-4"></div>
                    <div>
                        <Form.Group as={Row}>
                            <Form.Label column xl={3}>id</Form.Label>
                            <Col xl={9}>
                                <Form.Control type="number" readOnly value={this.state.id} />
                            </Col>
                        </Form.Group>
                        <div className="my-2"></div>
                        <Form.Group as={Row}>
                            <Form.Label column xl={3}>type</Form.Label>
                            <Col xl={9}>
                                <Form.Control type="text" readOnly={this.state.readonly}
                                    value={this.state.type}
                                    onChange={e => this.setState({ type: e.target.value })} />
                            </Col>
                        </Form.Group>
                        <div className="my-2"></div>
                        <Form.Group as={Row}>
                            <Form.Label column xl={3}>date</Form.Label>
                            <Col xl={9}>
                                <Form.Control type="date" readOnly={this.state.readonly}
                                    value={this.state.date}
                                    onChange={e => this.setState({ date: e.target.value })} />
                            </Col>
                        </Form.Group>
                        <div className="my-2"></div>
                        <Form.Group as={Row}>
                            <Form.Label column xl={3}>montant</Form.Label>
                            <Col xl={9}>
                                <Form.Control type="text" readOnly={this.state.readonly}
                                    value={this.state.montant}
                                    onChange={e => this.setState({ montant: e.target.value })} />
                            </Col>
                        </Form.Group>
                        <div className="my-2"></div>
                        <Form.Group as={Row}>
                            <Form.Label column xl={3}>remarque</Form.Label>
                            <Col xl={9}>
                                <Form.Control as="textarea" type="text"
                                    readOnly={this.state.readonly} value={this.state.remarque}
                                    onChange={e => this.setState({ remarque: e.target.value })} />
                            </Col>
                        </Form.Group>
                        <div className="my-2"></div>
                        <Form.Group as={Row}>
                            <Form.Label column xl={3}>id compte</Form.Label>
                            <Col xl={9}>
                                <Form.Control type="number" readOnly={this.state.readonly}
                                    value={this.state.idcompte}
                                    onChange={e => this.setState({ idcompte: e.target.value })} />
                            </Col>
                        </Form.Group>
                        <div className="my-2"></div>
                        <Form.Group as={Row}>
                            <Form.Label column xl={3}>id animal</Form.Label>
                            <Col xl={9}>
                                <Form.Control type="number" readOnly={this.state.readonly}
                                    value={this.state.idanimal}
                                    onChange={e => this.setState({ idanimal: e.target.value })} />
                            </Col>
                        </Form.Group>
                        <div className="my-2"></div>
                        <Form.Group as={Row}>
                            <Form.Label column xl={3}>id intervenant</Form.Label>
                            <Col xl={9}>
                                <Form.Control type="number" readOnly={this.state.readonly}
                                    value={this.state.idintervenant}
                                    onChange={e => this.setState({
                                        idintervenant: e.target.value
                                    })} />
                            </Col>
                        </Form.Group>
                        <div className="my-4"></div>
                        <div>
                            <Row>
                                <Col>
                                    <Button variant="outline-warning" className="w-100"
                                        onClick={() => this.handleClickOnEdit(this.state.id)}>
                                    {this.state.btnText}</Button>
                                </Col>
                                <Col>
                                    <Button variant="outline-primary" className="w-100"
                                        onClick={() => this.handleClickOnCancel(this.state.id)}>
                                    Cancel</Button>
                                </Col>
                                <Col>
                                    <Button variant="outline-danger" className="w-100"
                                        onClick={() => this.handleClickOnDel(this.state.id)}>
                                        Supprimer</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Tab>
                <Tab title="Compte" eventKey="compte">
                    <div className="my-4"></div>
                    <Compte history={this.props.history}
                        compte={this.props.compte} getComptes={this.props.getActions}
                        setError={this.props.setError} />
                </Tab>
                { this.state.animal !== undefined &&
                    <Tab title="Animal" eventKey="animal" className="">
                        <div className="my-4"></div>
                        <Animal history={this.props.history} animal={this.props.animal}
                            getAnimaux={this.props.getActions} setError={this.props.setError} />
                    </Tab>
                }
                { this.state.intervenant !== undefined &&
                    <Tab title="Intervenant" eventKey="intervenant">
                        <div className="my-4"></div>
                        <Intervenant history={this.props.history}
                            intervenant={this.props.intervenant}
                            getIntervenants={this.props.getActions}
                            setError={this.props.setError} />
                    </Tab>
                }
            </Tabs>
        );
    }
}

export default Action;
