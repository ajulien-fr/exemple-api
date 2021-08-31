import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Error from './../Error';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOnLogin = this.handleClickOnLogin.bind(this);
        this.handleClickOnCancel = this.handleClickOnCancel.bind(this);

        this.setError = this.setError.bind(this);

        this.state = {
            username: '',
            password: '',

            error: undefined
        };
    }

    handleClickOnLogin() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        };

        fetch('http://127.0.0.1:8000/api/login_check', requestOptions)
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                const error = (data && data.message) || response.status;

                return Promise.reject(error);
            }

            return data;
        })
        .then(data => {
            localStorage.setItem('token', data.token);

            this.props.history.push({ pathname: '/' });
        })
        .catch(error => {
            if (error.message) this.setError(error.message);

            else this.setError(error);
        })
    }

    handleClickOnCancel()
    {
        this.setState({ username: '' });
        this.setState({ password: '' });
    }

    setError(error) { this.setState({ error: error }); }

    render() {
        if (this.state.error !== undefined) {
            return (<Error error={this.state.error} setError={this.setError} />);
        }

        else return (
            <Container>
                <Row>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column lg={1}>username</Form.Label>
                            <Col lg="11">
                                <Form.Control type="text"
                                    value={this.state.username}
                                    onChange={e => this.setState({
                                        username: e.target.value
                                    })} />
                            </Col>
                        </Form.Group>
                        <div className="my-4"></div>
                        <Form.Group as={Row}>
                            <Form.Label column lg={1}>password</Form.Label>
                            <Col lg={11}>
                                <Form.Control type="password"
                                    value={this.state.password}
                                    onChange={e => this.setState({
                                        password: e.target.value
                                    })} />
                            </Col>
                        </Form.Group>
                    </Form>
                </Row>
                <div className="my-5"></div>
                <Row>
                    <Col md={6} className="mb-2 mb-md-0">
                        <Button variant="outline-warning" className="w-100"
                            onClick={this.handleClickOnCancel}>Cancel</Button>
                    </Col>
                    <Col md={6} className="mt-2 mt-md-0">
                        <Button variant="outline-danger" className="w-100"
                            onClick={this.handleClickOnLogin}>Login</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Login;
