import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { Bar } from 'react-chartjs-2';

import Error from './../Error';

class Accueil extends React.Component {
    constructor(props) {
        super(props);

        this.setError = this.setError.bind(this);

        this.state = {
            depensesChartData: undefined,
            recettesChartData: undefined,

            error: undefined
        };
    }

    componentDidMount() { this.getActivities(); }

    getActivities() {
        const token = localStorage.getItem('token');

        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +  token
            }
        };

        fetch('http://127.0.0.1:8000/api/activities', requestOptions)
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;

                    return Promise.reject(error);
                }

                return data;
            })
            .then(data => { this.setChartData(data); })
            .catch(error => {
                if (error.message) this.setError(error.message);

                else this.setError(error);
            })
    }

    setChartData(data) {
        var depenseLabelArr = [];
        var recetteLabelArr = [];
        var depenseArr = [];
        var recetteArr = [];
        var depenseNbr = [];
        var recetteNbr = [];

        return (
            data.map((activity) => (
                (parseFloat(activity.montant) < 0) ?
                    depenseLabelArr.push(activity.type) &&
                    depenseArr.push(parseFloat(Math.abs(activity.montant))) &&
                    depenseNbr.push(activity.nbr) :
                (parseFloat(activity.montant) > 0) ?
                    recetteLabelArr.push(activity.type) &&
                    recetteArr.push(parseFloat(activity.montant)) &&
                    recetteNbr.push(activity.nbr) : null
            )),

            this.setState({
                depenseChartData: {
                    labels: depenseLabelArr,
                    datasets: [
                        {
                            label: 'montants',
                            data: depenseArr,
                            borderWidth: 1,
                            backgroundColor: '#e76f51',
                            color: '#ffffff'
                        },
                        {
                            label: 'nombres',
                            data: depenseNbr,
                            borderWidth: 1,
                            backgroundColor: '#e9c46a',
                            color: '#ffffff'
                        }
                    ]
                },
                recetteChartData: {
                    labels: recetteLabelArr,
                    datasets: [
                        {
                            label: 'montants',
                            data: recetteArr,
                            borderWidth: 1,
                            backgroundColor: '#8ab17d',
                            color: '#ffffff'
                        },
                        {
                            label: 'nombres',
                            data: recetteNbr,
                            borderWidth: 1,
                            backgroundColor: '#e9c46a',
                            color: '#ffffff'
                        }
                    ]
                }
            })
        );
    }

    setError(error) { this.setState({ error: error }); }

    render() {
        const chartDepensesOptions = {
            elements: {
                bar: {
                    borderWidth: 2
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 18
                        },
                        color: '#ffffff'
                    }
                },
                title: {
                    display: true,
                    text: 'DÉPENSES',
                    color: '#ffffff',
                    font: {
                        size: 20
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 18
                        }
                    }
                },
                y: {
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 18
                        }
                    }
                }
            }
        }

        const chartRecettesOptions = {
            elements: {
                bar: {
                    borderWidth: 2
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 18
                        },
                        color: '#ffffff'
                    }
                },

                title: {
                    display: true,
                    text: 'RECETTES',
                    color: '#ffffff',
                    font: {
                        size: 20
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 18
                        }
                    }
                },
                y: {
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 18
                        }
                    }
                }
            }
        };

        if (this.state.error !== undefined) {
            return (<Error error={this.state.error} />);
        }

        else if ((localStorage.getItem('token') !== undefined) &&
            (this.state.depenseChartData !== undefined) &&
            (this.state.recetteChartData !== undefined)) {
            return (
                <Container fluid className="mb-4">
                    <Row>
                        <Col>
                            <Bar data={this.state.depenseChartData}
                                options={chartDepensesOptions} />
                        </Col>
                    </Row>
                    <hr className="my-4" />
                    <Row>
                        <Col>
                            <Bar data={this.state.recetteChartData} 
                                options={chartRecettesOptions} />
                        </Col>
                    </Row>
                </Container>
            );
        }

        else {
            return (
                <Container>
                    <Row className="justify-content-center">
                        <Spinner animation="border" role="status" variant="warning"></Spinner>
                    </Row>
                </Container>
            );
        }
    }
}

export default Accueil;
