import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function Error(props) {
    return (
        <Container>
            <Row>
                <Col>
                    <Alert show variant="danger">
                        <Alert.Heading>Erreur</Alert.Heading>
                        <p>{props.error}</p>
                        <hr />
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
}

export default Error;
