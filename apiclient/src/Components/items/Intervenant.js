import React from 'react';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class Intervenant extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOnDel = this.handleClickOnDel.bind(this);
        this.handleClickOnEdit = this.handleClickOnEdit.bind(this);
        this.handleClickOnCancel = this.handleClickOnCancel.bind(this);
        this.handleClickOnVoir = this.handleClickOnVoir.bind(this);

        this.state = {
            edit: false,

            btnText: 'Éditer',

            id: this.props.intervenant.id,
            nom: this.props.intervenant.nom,
            adresse: this.props.intervenant.adresse,
            code_postal: this.props.intervenant.code_postal,
            ville: this.props.intervenant.ville,
            phone: this.props.intervenant.phone,
            email: this.props.intervenant.email,
            remarque: this.props.intervenant.remarque,

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

        var url = 'http://127.0.0.1:8000/api/intervenants/' + id;

        fetch(url, requestOptions)
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.status;

                return Promise.reject(error);
            }

            return data;
        })
        .then(data => { this.props.getIntervenants(); })
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
                    nom: this.state.nom,
                    adresse: this.state.adresse,
                    code_postal: this.state.code_postal,
                    ville: this.state.ville,
                    phone: this.state.phone,
                    email: this.state.email,
                    remarque: this.state.remarque
                })
            };

            var url = 'http://127.0.0.1:8000/api/intervenants/' + id;

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

                this.props.getIntervenants();
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
            state: { idintervenant: id }
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
                    <Form.Label column xl={3}>nom</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="text" readOnly={this.state.readonly}
                            value={this.state.nom}
                            onChange={e => this.setState({ nom: e.target.value })} />
                    </Col>
                </Form.Group>
                <div className="my-2"></div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>adresse</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="text" readOnly={this.state.readonly}
                            value={this.state.adresse}
                            onChange={e => this.setState({ adresse: e.target.value })} />
                    </Col>
                </Form.Group>
                <div className="my-2"></div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>code postal</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="text" readOnly={this.state.readonly}
                            value={this.state.code_postal}
                            onChange={e => this.setState({
                                code_postal: e.target.value
                            })} />
                    </Col>
                </Form.Group>
                <div className="my-2"></div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>ville</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="text" readOnly={this.state.readonly}
                            value={this.state.ville}
                            onChange={e => this.setState({ ville: e.target.value })} />
                    </Col>
                </Form.Group>
                <div className="my-2"></div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>phone</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="tel" readOnly={this.state.readonly}
                            value={this.state.phone}
                            onChange={e => this.setState({ phone: e.target.value })} />
                    </Col>
                </Form.Group>
                <div className="my-2"></div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>email</Form.Label>
                    <Col xl={9}>
                        <Form.Control type="email" readOnly={this.state.readonly}
                            value={this.state.email}
                            onChange={e => this.setState({ email: e.target.value })} />
                    </Col>
                </Form.Group>
                <div className="my-2"></div>
                <Form.Group as={Row}>
                    <Form.Label column xl={3}>remarque</Form.Label>
                    <Col xl={9}>
                        <Form.Control as="textarea" type="text"
                            readOnly={this.state.readonly}
                            value={this.state.remarque}
                            onChange={e => this.setState({ remarque: e.target.value })} />
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
                                    onClick={() => this.handleClickOnCancel(this.state.id)}>
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

export default Intervenant;
