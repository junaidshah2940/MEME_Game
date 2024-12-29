import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LogoutButton } from "./AuthComponents";

function NavHeader(props) {
    return (
        <Navbar>
            <Container fluid>
                <Link to="/" className="navbar-brand">
                    MEME GAME
                </Link>
                {props.loggedIn ? (
                    <LogoutButton
                        logout={props.handleLogout}
                        user={props.user}
                    />
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </Container>
        </Navbar>
    );
}

export default NavHeader;
