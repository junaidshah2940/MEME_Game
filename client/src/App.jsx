import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import { Container, Row, Alert } from "react-bootstrap";
import { Routes, Route, Outlet, Navigate, Link } from "react-router-dom";
import NavHeader from "./components/NavHeader";
import { ImageLayout } from "./components/ImageComponents";
import { Unauth } from "./components/Unauth";
import NotFound from "./components/NotFoundComponent";
import { Login } from "./components/AuthComponents";
import { Homepage } from "./components/Homepage";
import { History } from "./components/History";
import Result from "./components/Result";
import Play from "./components/Play";
import ResultHistory from "./components/ResultHistory";
import API from "./API.mjs";

function App() {
    const [questions, setQuestions] = useState([]);
    const [answersUser, setAnswersUser] = useState([]);
    const [images, setImages] = useState([]);
    const [img, setSImages] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState("");
    const [ids, setIds] = useState([]);
    const [answers, setAnswers] = useState();
    const [cAnswers, setCAnswers] = useState();
    var r = useRef(null);

    useEffect(() => {
        const getQuestions = async () => {
            const questions = await API.getQuestions();
            setQuestions(questions);
        };
        getQuestions();
    }, []);

    useEffect(() => {
        const getAnswers = async () => {
            const answers = await API.getAnswers(user.name);
            setAnswersUser(answers);
        };
        getAnswers();
    }, [user.name]);

    useEffect(() => {
        const getImages = async () => {
            const images = await API.getImages();
            setImages(images);
        };
        getImages();
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const user = await API.getUserInfo();
            setLoggedIn(true);
            setUser(user);
        };
        checkAuth();
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const user = await API.logIn(credentials);
            setLoggedIn(true);
            setMessage({ msg: `Welcome, ${user.name}!`, type: "success" });
            setUser(user);
        } catch (err) {
            setMessage({ msg: err, type: "danger" });
        }
    };

    const handleLogout = async () => {
        await API.logOut();
        setLoggedIn(false);
        setMessage("");
    };

    const sendIds = (id) => {
        setIds(id);
    };

    const sendImages = (img) => {
        setSImages(img);
    };

    const sendAnswers = (answers) => {
        setAnswers(answers);
    };

    const sendMCAnswers = (cAnswers) => {
        setCAnswers(cAnswers);
    };

    return (
        <Routes>
            <Route
                element={
                    <>
                        <NavHeader
                            loggedIn={loggedIn}
                            handleLogout={handleLogout}
                            user={user.name}
                        />
                        <Container fluid className="mt-3">
                            {message && (
                                <Row>
                                    <Alert
                                        variant={message.type}
                                        onClose={() => setMessage("")}
                                        dismissible
                                    >
                                        {message.msg}
                                    </Alert>
                                </Row>
                            )}
                            <Outlet />
                        </Container>
                    </>
                }
            >
                <Route index element={loggedIn ? <Homepage /> : <Play />} />
                <Route
                    path="/unauth/:imageId"
                    element={
                        <Unauth
                            questions={questions}
                            images={images}
                            loggedIn={loggedIn}
                            user={user}
                        />
                    }
                />
                <Route
                    path="/images/:imageId"
                    element={
                        <ImageLayout
                            sendIds={sendIds}
                            sendImages={sendImages}
                            sendAnswers={sendAnswers}
                            sendMCAnswers={sendMCAnswers}
                            questions={questions}
                            images={images}
                            loggedIn={loggedIn}
                            user={user}
                        />
                    }
                />
                <Route path="*" element={<NotFound />} />
                <Route
                    path="/login"
                    element={
                        loggedIn ? (
                            <Navigate replace to="/" />
                        ) : (
                            <Login login={handleLogin} />
                        )
                    }
                />

                <Route
                    path="/history"
                    element={
                        loggedIn ? (
                            <History
                                user={user.name}
                                answersUser={answersUser}
                            />
                        ) : (
                            <Login login={handleLogin} />
                        )
                    }
                />

                <Route
                    path="/results/:id"
                    element={
                        loggedIn ? (
                            <ResultHistory answersUser={answersUser} />
                        ) : (
                            <Login login={handleLogin} />
                        )
                    }
                />

                <Route
                    path="/result"
                    element={
                        loggedIn ? (
                            <Result
                                user={user.name}
                                ids={ids}
                                img={img}
                                answers={answers}
                                cAnswers={cAnswers}
                            />
                        ) : null
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
