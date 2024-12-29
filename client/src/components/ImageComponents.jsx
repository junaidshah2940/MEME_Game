import { Col, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import API from "../API.mjs";

export function ImageLayout(props) {
    const [paragraphs, setParagraphs] = useState([]);
    const [check, setCheck] = useState(true);
    const [checkClick, setCheckClick] = useState(0);
    const [ids, setIds] = useState([]);
    const [sImages, setSImages] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [cImages, setCImages] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            if (ids.length == 3) {
                props.sendIds(ids);
                props.sendImages(sImages);
                props.sendAnswers(answers);
                props.sendMCAnswers(cImages);
                navigate(`/result`);
            }
        }, 2000);
    }, [ids]);

    const [change, setChange] = useState(true);
    function getUniqueRandomNumbers(min, max, numNumbers) {
        const uniqueNumbers = new Set();
        while (uniqueNumbers.size < numNumbers) {
            const randomNumber =
                Math.floor(Math.random() * (max - min + 1)) + min;
            if (!uniqueNumbers.has(randomNumber)) {
                uniqueNumbers.add(randomNumber);
            }
        }
        return Array.from(uniqueNumbers);
    }
    const handleClick = (e) => {
        setIds([...ids, e.target.id]);
        setAnswers([...answers, e.target.innerHTML]);
        setChange(false);
        setTimeout(() => {
            handleCheck(e.target.id);
        }, 2000);
    };

    useEffect(() => {
        const t = setTimeout(() => {
            setChange(true);
        }, 2000);
        return () => {
            clearTimeout(t);
        };
    }, [change]);

    const handleCheck = (id) => {
        if (id != undefined) {
            setTrigger((trigger) => trigger + 1);

            if (trigger >= 2) {
                navigate(`/images/${rNumbers[0]}`);
                setCheck(false);
            }
            setCheckClick(checkClick + 1);
        } else {
            setTrigger((trigger) => trigger + 1);
        }
    };

    const params = useParams();
    const image = props.images[params.imageId - 1];
    useEffect(() => {
        setSImages([...sImages, image]);
    }, [image]);
    const [images, setImages] = useState(["loading...", "loading..."]);
    const [trigger, setTrigger] = useState(0);

    const fQuestions = [];

    const rNumbers = getUniqueRandomNumbers(1, 50, 5);
    for (let i = 0; i < 5; i++) {
        fQuestions.push(props.questions[rNumbers[i]]);
    }

    useEffect(() => {
        const t = setTimeout(() => {
            setTrigger((trigger) => trigger + 1);
            if (trigger >= 2) {
                navigate(`/`);
            }
        }, 30000);
        return () => {
            clearTimeout(t);
        };
    }, [trigger]);

    const navigate = useNavigate();
    useEffect(() => {
        const getImages = async () => {
            const images = await API.getImagesAnswers(rNumbers[0]);
            setImages(images);
            setCImages([...cImages, images]);
        };
        getImages();
        navigate(`/images/${rNumbers[0]}`);
    }, [trigger]);

    useEffect(() => {
        const getImages = async () => {
            const images = await API.getImagesAnswers(params.imageId);
            setImages(images);
        };
        getImages();
    }, []);

    const allQuestions = [...fQuestions, ...images];

    useEffect(() => {
        setParagraphs(allQuestions);
    }, [images]);

    return (
        <>
            {image ? (
                <>
                    {check ? (
                        <Timer
                            loggedIn={props.loggedIn}
                            checkClick={checkClick}
                            handleCheck={handleCheck}
                        />
                    ) : null}

                    <ImageDescription
                        change={change}
                        image={image}
                        questions={paragraphs}
                        handleClick={handleClick}
                    />
                </>
            ) : (
                <p className="lead">The selected question does not exist!</p>
            )}
        </>
    );
}

function ImageDescription(props) {
    function shuffleWithIndex(list) {
        const shuffledList = [...list];
        const indices = Array.from({ length: list.length }, (_, i) => i); // Create array with indices

        for (let i = shuffledList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledList[i], shuffledList[j]] = [
                shuffledList[j],
                shuffledList[i],
            ];
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        return { shuffledList, indices };
    }

    const [list, setList] = useState([]);
    const [ind, setInd] = useState([]);

    useEffect(() => {
        const { shuffledList, indices } = shuffleWithIndex(props.questions);
        setList(shuffledList);
        setInd(indices);
    }, [props.questions]);

    return (
        <>
            <div className="q-rows">
                <Col md={6} as="p">
                    <strong className="image-tag">
                        Image #{props.image.id}:
                    </strong>
                </Col>
            </div>

            <div className="q-rows">
                <img
                    className="image-question"
                    src={"http://localhost:3001/" + props.image.url}
                />
                <ol className="options">
                    {list.map((q, i) => (
                        <QuestionRow
                            change={props.change}
                            questions={q}
                            key={ind[i]}
                            handleClick={props.handleClick}
                            id={ind[i]}
                        />
                    ))}
                </ol>
            </div>
        </>
    );
}

function QuestionRow(props) {
    return props.change ? (
        <li id={"_" + props.id} onClick={props.handleClick}>
            {props.questions.text}
        </li>
    ) : (
        <li id={"_" + props.id} className="colored" onClick={props.handleClick}>
            {props.questions.text}
        </li>
    );
}
