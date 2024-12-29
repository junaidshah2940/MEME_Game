import { Col, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import API from "../API.mjs";

export function Unauth(props) {
    const [paragraphs, setParagraphs] = useState([]);
    const [sImages, setSImages] = useState([]);
    const [change, setChange] = useState(true);

    const navigate = useNavigate();

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

    const handleClick = () => {
        setChange(false);
    };

    useEffect(() => {
        if (!change) {
            const t = setTimeout(() => {
                setChange(true);
                navigate("/");
            }, 5000);
        }
    }, [change]);

    const params = useParams();
    const image = props.images[params.imageId - 1];
    useEffect(() => {
        setSImages([...sImages, image]);
    }, [image]);
    const [images, setImages] = useState(["loading...", "loading..."]);

    const fQuestions = [];

    const rNumbers = getUniqueRandomNumbers(1, 50, 5);
    for (let i = 0; i < 5; i++) {
        fQuestions.push(props.questions[rNumbers[i]]);
    }

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
                    <Timer loggedIn={false} />

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
            <Row>
                <Col md={6} as="p">
                    <strong className="image-tag">
                        Image #{props.image.id}:
                    </strong>
                </Col>
            </Row>

            <Row>
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
            </Row>
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
