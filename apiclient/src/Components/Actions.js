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
import Spinner from 'react-bootstrap/Spinner';

import Action from './items/Action';

import Error from './../Error';

class Actions extends React.Component {
    constructor(props) {
        super(props);

        this.btnRef = React.createRef();

        this.getActions = this.getActions.bind(this);

        this.handleClickOnClose = this.handleClickOnClose.bind(this);
        this.handleClickOnSave = this.handleClickOnSave.bind(this);
        this.handleClickOnGo = this.handleClickOnGo.bind(this);
        this.handleClickOnSearch = this.handleClickOnSearch.bind(this);

        this.setError = this.setError.bind(this);

        this.state = {
            data: undefined,

            offset: 0,
            limit: 10,

            inputType: '',
            inputDate: '',
            inputMontant: '',
            inputRemarque: '',
            inputIdCompte: '',
            inputIdAnimal: '',
            inputIdIntervenant: '',
            inputSearch: '',

            idcompte: (typeof this.props.location.state !== 'undefined') ?
                        (typeof this.props.location.state.idcompte !== 'undefined') ?
                         this.props.location.state.idcompte : 0 : 0,

            idanimal: (typeof this.props.location.state !== 'undefined') ?
                        (typeof this.props.location.state.idanimal !== 'undefined') ?
                        this.props.location.state.idanimal : 0 : 0,
                            
            idintervenant: (typeof this.props.location.state !== 'undefined') ?
                            (typeof this.props.location.state.idintervenant !== 'undefined') ?
                            this.props.location.state.idintervenant : 0 : 0,

            error: undefined
        };
    }

    getActions() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var url = 'http://127.0.0.1:8000/api/actions' +
            '?offset=' + this.state.offset +
            '&limit=' + this.state.limit +
            '&idcompte=' + this.state.idcompte +
            '&idanimal=' + this.state.idanimal +
            '&idintervenant=' + this.state.idintervenant;

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
            .then(data => { this.setState({ data: data.actions }); })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    handleClickOnClose() {
        this.btnRef.current.click();

        this.setState({ inputType: '' });
        this.setState({ inputDate: '' });
        this.setState({ inputMontant: '' });
        this.setState({ inputRemarque: '' });
        this.setState({ inputIdCompte: '' });
        this.setState({ inputIdAnimal: '' });
        this.setState({ inputIdIntervenant: '' });
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
                type: this.state.inputType,
                date: this.state.inputDate,
                /* eslint no-eval: 0 */
                montant: eval(this.state.inputMontant),
                remarque: this.state.inputRemarque,
                idcompte: this.state.inputIdCompte,
                idanimal: this.state.inputIdAnimal,
                idintervenant: this.state.inputIdIntervenant
            })
        };

        if (!this.checkMontant(this.state.inputMontant)) {
            this.setError('montant invalide');

            return;
        }

        fetch('http://127.0.0.1:8000/api/actions', requestOptions)
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
                this.getActions();
            })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
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

    handleClickOnGo() { this.getActions(); }

    handleClickOnSearch() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        var url = 'http://127.0.0.1:8000/api/search/actions' +
            '?search=' + this.state.inputSearch;

        this.setState({ data: undefined });

        if (this.state.inputSearch.trim() === '') return this.getActions();
        
        fetch(url, requestOptions)
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;

                    return Promise.reject(error);
                }

                return data;
            })
            .then(data => { this.setState({ data: data.actions }); })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            });
    }

    setError(error) { this.setState({ error: error }); }

    componentDidMount() { this.getActions(); }

    render() {
        if (this.state.error !== undefined) {
            return (<Error error={this.state.error} className="mt-4" />);
        }

        else if (this.state.data !== undefined) {
            return (
                <Container fluid>
                    <Row>
                        <Accordion>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0"
                                ref={this.btnRef}>
                                Ajouter une action
                            </Accordion.Toggle>
                            <div className="my-4"></div>
                            <Accordion.Collapse eventKey="0">
                                <div>
                                    <Form>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>type</Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="text"
                                                    value={this.state.inputType}
                                                    onChange={e => this.setState({
                                                        inputType: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-4"></div>
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
                                            <Form.Label column md={2} xl={1}>montant</Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="text"
                                                    value={this.state.inputMontant}
                                                    onChange={e => this.setState({
                                                        inputMontant: e.target.value
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
                                        <div className="my-4"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>id compte</Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="number"
                                                    value={this.state.inputIdCompte}
                                                    onChange={e => this.setState({
                                                        inputIdCompte: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-4"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>id animal</Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="number"
                                                    value={this.state.inputIdAnimal}
                                                    onChange={e => this.setState({
                                                        inputIdAnimal: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                        <div className="my-4"></div>
                                        <Form.Group as={Row}>
                                            <Form.Label column md={2} xl={1}>
                                                id intervenant
                                            </Form.Label>
                                            <Col md={10} xl={11}>
                                                <Form.Control type="number"
                                                    value={this.state.inputIdIntervenant}
                                                    onChange={e => this.setState({
                                                        inputIdIntervenant: e.target.value
                                                    })} />
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                    <div className="my-4"></div>
                                    <div>
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
                                        inputSearch: e.target.value })}
                                        aria-label="search" />
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
                                <FormControl type="number"
                                    value={this.state.offset}
                                    onChange={e => this.setState({
                                    offset: e.target.value })} aria-label="offset" />
                                <InputGroup.Text>limit</InputGroup.Text>
                                <FormControl type="number"
                                    value={this.state.limit}
                                    onChange={e => this.setState({
                                        limit: e.target.value })} aria-label="limit" />
                                <Button variant="secondary"
                                    onClick={this.handleClickOnGo}>Go</Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <div className="my-4"></div>
                    <Row>
                        <Col xl={6}>
                            <InputGroup>
                                <InputGroup.Text>id compte</InputGroup.Text>
                                <FormControl
                                    type="number"
                                    value={this.state.idcompte}
                                    onChange={e => this.setState({
                                    idcompte: e.target.value })} aria-label="idcompte" />
                                <InputGroup.Text>id animal</InputGroup.Text>
                                <FormControl
                                    type="number"
                                    value={this.state.idanimal}
                                    onChange={e => this.setState({
                                        idanimal: e.target.value })} aria-label="idanimal" />
                                <InputGroup.Text>id intervenant</InputGroup.Text>
                                <FormControl
                                    type="number"
                                    value={this.state.idintervenant}
                                    onChange={e => this.setState({
                                        idintervenant: e.target.value})}
                                    aria-label="idintervenant" />
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
                                                <Action history={this.props.history}
                                                    action={item.action}
                                                    animal={item.animal}
                                                    intervenant={item.intervenant}
                                                    compte={item.compte}
                                                    getActions={this.getActions}
                                                    setError={this.setError} />
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
            <Container>
                <Row className="justify-content-center">
                    <Spinner animation="border" role="status" variant="warning"></Spinner>
                </Row>
            </Container>
        );
    }
}

export default Actions;
