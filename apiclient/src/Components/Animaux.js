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

import Animal from './items/Animal';

import Error from './../Error';

class Animaux extends React.Component {
    constructor(props) {
        super(props);

        this.btnRef = React.createRef();

        this.getAnimaux = this.getAnimaux.bind(this);

        this.handleClickOnClose = this.handleClickOnClose.bind(this);
        this.handleClickOnSave = this.handleClickOnSave.bind(this);
        this.handleClickOnGo = this.handleClickOnGo.bind(this);
        this.handleClickOnSearch = this.handleClickOnSearch.bind(this);

        this.setError = this.setError.bind(this);

        this.state = {
            data: undefined,

            offset: 0,
            limit: 10,

            inputFamille: '',
            inputNom: '',
            inputDescription: '',
            inputRemarque: '',
            inputSearch: '',

            error: undefined
        };
    }

    getAnimaux() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var url = 'http://127.0.0.1:8000/api/animaux' +
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
            .then(data => { this.setState({ data: data.animaux }); })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    handleClickOnClose() {
        this.btnRef.current.click();

        this.setState({ inputFamille: '' });
        this.setState({ inputNom: '' });
        this.setState({ inputDescription: '' });
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
                famille: this.state.inputFamille,
                nom: this.state.inputNom,
                description: this.state.inputDescription,
                remarque: this.state.inputRemarque
            })
        };

        fetch('http://127.0.0.1:8000/api/animaux', requestOptions)
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
                this.getAnimaux();
            })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    handleClickOnGo() { this.getAnimaux(); }

    handleClickOnSearch() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var url = 'http://127.0.0.1:8000/api/search/animaux' +
            '?search=' + this.state.inputSearch;

        this.setState({ data: undefined });

        if (this.state.inputSearch.trim() === '') return this.getAnimaux();

        fetch(url, requestOptions)
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;

                    return Promise.reject(error);
                }

                return data;
            })
            .then(data => { this.setState({ data: data.animaux }); })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    setError(error) { this.setState({ error: error }); }

    componentDidMount() { this.getAnimaux(); }

    render() {
        if (this.state.error !== undefined) {
            return (<Error error={this.state.error} setError={this.setError} />);
        }

        else if (this.state.data !== undefined) {
            return (
                <Container fluid>
                    <Row>
                        <Accordion>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0"
                                ref={this.btnRef}>
                                Ajouter un animal
                            </Accordion.Toggle>
                            <div className="my-4"></div>
                            <Accordion.Collapse eventKey="0">
                                <div>
                                    <Form>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>famille</Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="text"
                                                    value={this.state.inputFamille}
                                                    onChange={e => this.setState({
                                                        inputFamille: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-4"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>nom</Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="text"
                                                    value={this.state.inputNom}
                                                    onChange={e => this.setState({
                                                        inputNom: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-4"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>
                                                description
                                            </Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="text"
                                                    value={this.state.inputDescription}
                                                    onChange={e => this.setState({
                                                        inputDescription: e.target.value
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
                        { (this.state.data !== undefined) ? (
                            this.state.data.map((item, index) => {
                                return (
                                    <Col key={index} lg={6} xl={4} className="mb-4">
                                        <Card border="warning">
                                            <Card.Body>
                                                <Tabs defaultActiveKey="animal">
                                                    <Tab title="Animal" eventKey="animal">
                                                        <div className="mb-4"></div>
                                                        <Animal history={this.props.history}
                                                            animal={item.animal}
                                                            getAnimaux={this.getAnimaux}
                                                            setError={this.setError} />
                                                    </Tab>
                                                </Tabs>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })
                        ) : null }
                    </Row>
                </Container>
            );
        }

        else return (
            <Container fluid className="mt-4">
                <Row className="justify-content-center">
                    <Spinner animation="border" role="status" variant="warning"></Spinner>
                </Row>
            </Container>
        );
    }
}

export default Animaux;
