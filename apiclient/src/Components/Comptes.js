import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Spinner from 'react-bootstrap/Spinner';

import Compte from './items/Compte';

import Error from './../Error';

class Comptes extends React.Component {
    constructor(props) {
        super(props);

        this.btnRef = React.createRef();

        this.getComptes = this.getComptes.bind(this);

        this.handleClickOnClose = this.handleClickOnClose.bind(this);
        this.handleClickOnSave = this.handleClickOnSave.bind(this);
        this.handleClickOnGo = this.handleClickOnGo.bind(this);
        this.handleClickOnSearch = this.handleClickOnSearch.bind(this);

        this.setError = this.setError.bind(this);

        this.state = {
            data: undefined,

            offset: 0,
            limit: 10,

            inputDate: '',
            inputMontantDepart: '',
            inputMontantActuel: '',
            inputRemarque: '',
            inputSearch: '',

            error: undefined
        };
    }

    getComptes() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var url = 'http://127.0.0.1:8000/api/comptes' +
            '?offset=' + this.state.offset +
            '&limit=' + this.state.limit;

        this.setState({ data: undefined });

        fetch(url, requestOptions)
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;

                    return Promise.reject(error);
                }

                return data;
            })
            .then(data => { this.setState({ data: data.comptes }); })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    handleClickOnClose() {
        this.btnRef.current.click();

        this.setState({ inputDate: '' });
        this.setState({ inputMontantDepart: '' });
        this.setState({ inputMontantActuel: '' });
        this.setState({ inputRemarque: '' });
    }

    handleClickOnSave() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                date: this.state.inputDate,
                montantDepart: this.state.inputMontantDepart,
                montantActuel: this.state.inputMontantActuel,
                remarque: this.state.inputRemarque
            })
        };

        fetch('http://127.0.0.1:8000/api/comptes', requestOptions)
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;

                    return Promise.reject(error);
                }

                return data;
            })
            .then(data => {
                this.handleClickOnClose();
                this.getComptes();
            })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    handleClickOnGo() { this.getComptes(); }

    handleClickOnSearch() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var url = 'http://127.0.0.1:8000/api/search/comptes' +
            '?search=' + this.state.inputSearch;

        this.setState({ data: undefined });

        if (this.state.inputSearch.trim() === '') return this.getComptes();

        fetch(url, requestOptions)
            .then(async response => {
                const data = await response.json();
                
                if (!response.ok) {
                    const error = (data && data.message) || response.status;

                    return Promise.reject(error);
                }

                return data;
            })
            .then(data => { this.setState({ data: data.comptes }); })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    setError(error) { this.setState({ error: error }); }

    componentDidMount() { this.getComptes(); }

    render() {
        if (this.state.error !== undefined) {
            return (<Error error={this.state.error} />);
        }

        else if (this.state.data !== undefined) {
            return (
                <Container fluid>
                    <Row>
                        <Accordion>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0"
                                ref={this.btnRef}>Ajouter un compte</Accordion.Toggle>
                            <div className="my-4"></div>
                            <Accordion.Collapse eventKey="0">
                                <div>
                                    <Form>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>date</Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="date"
                                                    value={this.state.inputDate}
                                                    onChange={e => this.setState({
                                                        inputDate: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-4"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>
                                                montant départ
                                            </Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="number"
                                                    value={this.state.inputMontantDepart}
                                                    onChange={e => this.setState({
                                                        inputMontantDepart: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-4"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>
                                                montant actuel
                                            </Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="number"
                                                    value={this.state.inputMontantActuel}
                                                    onChange={e => this.setState({
                                                        inputMontantActuel: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-4"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>remarque</Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control as="textarea" type="text"
                                                    value={this.state.inputRemarque}
                                                    onChange={e => this.setState({
                                                        inputRemarque: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                    <div className="my-4"></div>
                                    <div className="text-center">
                                        <Button variant="outline-warning"
                                            onClick={this.handleClickOnClose}
                                            className="w-50">Close</Button>
                                        <Button variant="outline-danger"
                                            onClick={this.handleClickOnSave}
                                            className="w-50">Sauvegarder</Button>
                                    </div>
                                    <div className="my-4"></div>
                                </div>
                            </Accordion.Collapse>
                        </Accordion>
                    </Row>
                    <Row>
                        <Col md={8} lg={6} xl={4}>
                            <InputGroup>
                                <InputGroup.Text>search</InputGroup.Text>
                                <FormControl type="text" value={this.state.inputSearch}
                                    onChange={e => this.setState({
                                        inputSearch: e.target.value
                                    })} aria-label="search" />
                                <Button variant="secondary"
                                    onClick={this.handleClickOnSearch}>Search</Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <div className="my-4"></div>
                    <Row>
                        <Col md={8} lg={6} xl={4}>
                            <InputGroup>
                                <InputGroup.Text>offset</InputGroup.Text>
                                    <FormControl type="number" value={this.state.offset}
                                        onChange={e => this.setState({
                                            offset: e.target.value
                                        })} aria-label="offset" />
                                <InputGroup.Text>limit</InputGroup.Text>
                                    <FormControl type="number" value={this.state.limit}
                                        onChange={e => this.setState({
                                            limit: e.target.value
                                        })} aria-label="limit" />
                                <Button variant="secondary"
                                    onClick={this.handleClickOnGo}>Go</Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <div className="my-5"></div>
                    <Row>
                        { this.state.data !== undefined ? (this.state.data.map((item, index) => {
                            return (
                                <Col key={index} lg={6} xl={4} className="mb-4">
                                    <Card border="warning">
                                        <Card.Body>
                                            <Tabs defaultActiveKey="compte">
                                                <Tab title="Compte" eventKey="compte">
                                                    <div className="mb-4"></div>
                                                    <Compte history={this.props.history}
                                                        compte={item.compte}
                                                        getComptes={this.getComptes}
                                                        setError={this.setError} />
                                                </Tab>
                                            </Tabs>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })) : null }
                    </Row>
                </Container>
            );
        }

        else return (
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Spinner animation="border" role="status" variant="warning"></Spinner>
                </Row>
            </Container>
        );
    }
}

export default Comptes;
