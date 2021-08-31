import { useLocation } from "react-router";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCat, faPiggyBank, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import { faHandPeace, faAddressBook } from '@fortawesome/free-regular-svg-icons';

function Header(props) {
    const location = useLocation();

    return (
        <Navbar expand="md" className="px-2 mb-4">
            <Navbar.Toggle />
            <Navbar.Collapse className="me-auto">
                <Nav defaultActiveKey="/" activeKey={location.pathname}>
                    <Nav.Link href="/">
                        <FontAwesomeIcon icon={faHome} />
                        <span> Accueil</span>
                    </Nav.Link>
                    <Nav.Link href="/actions">
                        <FontAwesomeIcon icon={faHandPeace} />
                        <span> Actions</span>
                    </Nav.Link>
                    <Nav.Link href="/animaux">
                        <FontAwesomeIcon icon={faCat} />
                        <span> Animaux</span>
                    </Nav.Link>
                    <Nav.Link href="/intervenants">
                        <FontAwesomeIcon icon={faAddressBook} />
                        <span> Intervenants</span>
                    </Nav.Link>
                    <Nav.Link href="/comptes">
                        <FontAwesomeIcon icon={faPiggyBank} />
                        <span> Comptes</span>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="ms-auto justify-content-end">
                <Nav activeKey={location.pathname}>
                    <Nav.Link href="/users">
                        <FontAwesomeIcon icon={faUsers} />
                        <span> Utilisateurs</span>
                    </Nav.Link>
                    <Nav.Link href="/login">
                        <FontAwesomeIcon icon={faUser} />
                        <span> Login</span>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;
