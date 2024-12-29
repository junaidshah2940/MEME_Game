import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../style.css";
import image from "../assets/kpi-concept-infographic-design_23-2148580288.avif";
import google from "../assets/2.png";
import apple from "../assets/apple-logo-24.png";

function LoginForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const credentials = { username, password };

        props.login(credentials);
    };

    return (
        <Row>
            <Col md={6}>
                <Form onSubmit={handleSubmit}>
                    <div className="inputs" id="username">
                        <label htmlFor="email">email: </label>
                        <input
                            type="email"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(ev) => setUsername(ev.target.value)}
                            required={true}
                        />
                    </div>

                    <div className="inputs" id="password">
                        <label htmlFor="password">Password: </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                            required={true}
                            minLength={6}
                        />
                    </div>

                    <div className="inputs">
                        <label htmlFor="submit"></label>
                        <input
                            onSubmit={handleSubmit}
                            type="submit"
                            name="submit"
                            value="Login"
                        />
                    </div>

                    <Link className="cancel-form" to={"/"}>
                        Cancel
                    </Link>
                </Form>
            </Col>
        </Row>
    );
}

function LogoutButton(props) {
    return (
        <div>
            <Link to={`./history`}>{props.user}</Link>
            <Button variant="outline-light" onClick={props.logout}>
                Logout
            </Button>
        </div>
    );
}

function Leftside(props) {
    return (
        <div className="wrapper">
            <Signin />
            <LoginForm login={props.login} />
        </div>
    );
}

function Rightside() {
    return (
        <div className="wrapper">
            <h1>Why should I login?</h1>
            <p>
                By logging in, you can access your personal dashboard, where you
                can manage your account, view your profile and history, and much
                more.
            </p>
            <div className="image">
                <img src={image} alt="" />
            </div>
        </div>
    );
}

function Login(props) {
    return (
        <section>
            <div className="left">
                <Leftside login={props.login} />
            </div>
            <div className="right">
                <Rightside />
            </div>
        </section>
    );
}

const Signin = () => {
    return (
        <div className="signins">
            <h1>Login! &#128075;</h1>
            <p>How do I get started?</p>

            <div className="google">
                <img src={google} alt="" />
                <button>Sign in with Google</button>
            </div>

            <div className="apple">
                <img src={apple} alt="" />
                <button>Sign in with Apple</button>
            </div>
        </div>
    );
};

export { Login, LogoutButton };
