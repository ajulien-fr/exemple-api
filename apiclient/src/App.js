import { Switch, Route } from 'react-router-dom';
import { useHistory, useLocation } from "react-router";

import Header from './Header';

import Accueil from './Components/Accueil';
import Comptes from './Components/Comptes';
import Actions from './Components/Actions';
import Animaux from './Components/Animaux';
import Intervenants from './Components/Intervenants';
import Users from './Components/Users';
import Login from './Components/Login';

import './App.scss';

function App() {
    const history = useHistory();
    const location = useLocation();

    return (
        <div className="App">
            <Header className="App-header" />
            <Switch>
                <Route exact path="/" render={() => <Accueil history={history} />} />
                
                <Route exact path="/actions" render={() => <Actions history={history}
                    location={location} />} />

                <Route exact path="/animaux" render={() => <Animaux history={history}
                    location={location} />} />

                <Route exact path="/intervenants"
                    render={() => <Intervenants history={history} />}
                    location={location} />

                <Route exact path="/comptes"
                    render={() => <Comptes history={history} />}
                    location={location} />

                <Route exact path="/users" render={() => <Users history={history} />}
                location={location} />

                <Route exact path="/login" render={() => <Login history={history} />}
                location={location} />
            </Switch>
        </div>
    );
}

export default App;
