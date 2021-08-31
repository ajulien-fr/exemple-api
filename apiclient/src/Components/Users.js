import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import Error from './../Error';

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOnRegister = this.handleClickOnRegister.bind(this);
        this.handleClickOnCancel = this.handleClickOnCancel.bind(this);
        this.handleClickOnDelete = this.handleClickOnDelete.bind(this);

        this.setError = this.setError.bind(this);

        this.state = {
            data: undefined,

            inputUsername: '',
            inputPassword: '',

            error: undefined
        };
    }

    componentDidMount() { this.getUsers(); }

    getUsers() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        this.setState({ data: undefined });

        fetch('http://127.0.0.1:8000/api/users', requestOptions)
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.status;

                return Promise.reject(error);
            }

            return data;
        })
        .then(data => { this.setState({ data: data.users }); })
        .catch(error => {
            if (error.message) this.setError(error.message);

            else this.setError(error);
        })
    }

    handleClickOnRegister() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                username: this.state.inputUsername,
                password: this.state.inputPassword
            })
        };

        fetch('http://127.0.0.1:8000/api/register', requestOptions)
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.status;

                localStorage.setItem('token', undefined);

                return Promise.reject(error);
            }

            return data;
        })
        .then(data => {
            this.setState({ inputUsername: '' });
            this.setState({ inputPassword: '' });

            window.location.reload();
        })
        .catch(error => {
            if (error.message) this.setError(error.message);

            else this.setError(error);
        })
    }

    handleClickOnCancel() {
        this.setState({ inputUsername: '' });
        this.setState({ inputPassword: '' });
    }

    handleClickOnDelete(id) {
        const token = localStorage.getItem('token');

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var url = 'http://127.0.0.1:8000/api/users/' + id;

        fetch(url, requestOptions)
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.status;

                return Promise.reject(error);
            }

            return data;
        })
        .then(data => { this.getUsers(); })
        .catch(error => {
            if (error.message) this.setError(error.message);

            else this.setError(error);
        });
    }

    setError(error) { this.setState({ error: error }); }

    render() {
        if (this.state.error !== undefined) {
            return (<Error error={this.state.error} setError={this.setError} />);
        }

        else if (this.state.data !== undefined) {
            return (
                <Container>
                    <Row>
                        <Form>
                            <Form.Group as={Row}>
                                <Form.Label column xl={1}>username</Form.Label>
                                <Col lg={11}>
                                    <Form.Control type="text"
                                        value={this.state.inputUsername}
                                        onChange={e => this.setState({
                                            inputUsername: e.target.value
                                        })} />
                                </Col>
                            </Form.Group>
                            <div className="my-4"></div>
                            <Form.Group as={Row}>
                                <Form.Label column lg={1}>password</Form.Label>
                                <Col xl={11}>
                                    <Form.Control type="password"
                                        value={this.state.inputPassword}
                                        onChange={e => this.setState({
                                            inputPassword: e.target.value
                                        })} />
                                </Col>
                            </Form.Group>
                        </Form>
                    </Row>
                    <div className="my-5"></div>
                    <Row>
                        <Col md={6} className="mt-2 mt-md-0">
                            <Button variant="outline-success" className="w-100"
                                onClick={this.handleClickOnCancel}>Cancel</Button>
                        </Col>
                        <Col md={6} className="mt-2 mt-md-0">
                            <Button variant="outline-warning" className="w-100"
                                onClick={this.handleClickOnRegister}>Register</Button>
                        </Col>
                    </Row>
                    <div className="my-5"></div>
                    <hr />
                    <div className="my-5"></div>
                    <Row>
                        { this.state.data !== undefined ? (this.state.data.map((item, index) => {
                            return (
                                <div key={index} className="mb-5">
                                    <Form>
                                        <Form.Group as={Row}>
                                            <Form.Label column lg={1}>id</Form.Label>
                                            <Col lg={11}>
                                                <Form.Control type="text"
                                                    value={item.user.id} readOnly />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-2"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column xl={1}>username</Form.Label>
                                            <Col lg={11}>
                                                <Form.Control type="text"
                                                    value={item.user.username} readOnly />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-2"></div>
                                        <Button variant="outline-danger"
                                            className="w-50 float-end"
                                            onClick={() => this.handleClickOnDelete(item.user.id)}>
                                            Supprimer
                                        </Button>
                                    </Form>
                                </div>
                            );
                        })) : null }
                    </Row>
                </Container>
            );
        }

        else return (
            <Container>
                <Row className="justify-content-center">
                    <Spinner animation="border" role="status" variant="warning">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Row>
            </Container>
        );
    }
}

export default Users;
