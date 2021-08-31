import React from 'react'

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class Compte extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOnDel = this.handleClickOnDel.bind(this);
        this.handleClickOnEdit = this.handleClickOnEdit.bind(this);
        this.handleClickOnCancel = this.handleClickOnCancel.bind(this);
        this.handleClickOnVoir = this.handleClickOnVoir.bind(this); 

        this.state = {
            edit: false,

            btnText: 'Éditer',

            id: this.props.compte.id,
            date: this.props.compte.date,
            montantDepart: this.props.compte.montantDepart,
            montantActuel: this.props.compte.montantActuel,
            remarque: this.props.compte.remarque,

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

        var url = 'http://127.0.0.1:8000/api/comptes/' + id;

        fetch(url, requestOptions)
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.status;

                return Promise.reject(error);
            }

            return data;
        })
        .then(data => { this.props.getComptes(); })
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
                    date: this.state.date,
                    montantDepart: this.state.montantDepart,
                    montantActuel: this.state.montantActuel,
                    remarque: this.state.remarque
                })
            };

            var url = 'http://127.0.0.1:8000/api/comptes/' + id;

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
                this.setState({ edit: false, btnText: 'Éditer', readonly: true })

                this.props.getComptes();
            })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
        }
    }

    handleClickOnCancel() {
        if (this.state.edit === true) {
            this.setState({ edit: false, btnText: 'Éditer', readonly: true });
        }
    }

    handleClickOnVoir(id) {       
        this.props.history.push({
            pathname: '/actions',
            state: { idcompte: id }
        });

        window.location.reload();
    }

    render() {
        return (
            <div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>id</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="number" readOnly value={this.state.id} />
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
                    <Form.Label column xl={3}>montant départ</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="number" readOnly={this.state.readonly}
                            value={this.state.montantDepart}
                            onChange={e => this.setState({
                                montantDepart: e.target.value
                            })} />
                    </Col>
                </Form.Group>
                <div className="my-2"></div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>montant actuel</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="number" readOnly={this.state.readonly}
                            value={this.state.montantActuel}
                            onChange={e => this.setState({
                                montantActuel: e.target.value
                            })} />
                    </Col>
                </Form.Group>
                <div className="my-2"></div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>remarque</Form.Label>
                    <Col xl={9}>
                        <Form.Control as="textarea" type="text"
                            readOnly={this.state.readonly} value={this.state.remarque}
                            onChange={e => this.setState({
                                remarque: e.target.value
                            })} />
                    </Col>
                </Form.Group>
                <div className="my-4"></div>
                <div>
                    <Row>
                        <Col>
                            <Button variant="outline-warning" className="w-100"
                                onClick={() => this.handleClickOnEdit(this.state.id)}>
                                {this.state.btnText}
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="outline-danger" className="w-100"
                                onClick={() => this.handleClickOnDel(this.state.id)}>
                                Supprimer
                            </Button>
                        </Col>
                    </Row>
                    <div className="my-2"></div>
                    <Row>
                        <Col>
                            <Button variant="outline-primary" className="w-100"
                                onClick={() => this.handleClickOnCancel()}>
                                Cancel
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="outline-success" className="w-100"
                                onClick={() => this.handleClickOnVoir(this.state.id)}>
                                Voir
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Compte;
