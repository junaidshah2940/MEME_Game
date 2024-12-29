import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Result(props) {
    const [points, setPoints] = useState(0);
    const [check, setCheck] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [canswers, setcAnswers] = useState([]);
    const [images, setImages] = useState([]);
    const hasStateChanged = useRef(false);

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
    const randomNumber = getUniqueRandomNumbers(1, 50, 1);

    const calPoints = () => {
        props.ids.forEach((element) => {
            if (element == "_5" || element == "_6") {
                setPoints((points) => points + 5);
            }
        });
        var ans = [];
        props.answers.forEach((el) => {
            ans = [...ans, { el }];
        });
        setAnswers(ans);
        var img = [];
        for (let i = 1; i < 4; i++) {
            img = [...img, { 0: props.img[i].url }];
        }
        setImages(img);
        var cans = [];
        props.cAnswers.forEach((el) => {
            cans = [...cans, { 0: el[0].text, 1: el[1].text }];
        });
        setcAnswers(cans);
    };

    useEffect(() => {
        calPoints();
        setCheck(true);
    }, []);

    useEffect(() => {
        if (check) {
            hasStateChanged.current = true;
        }
        if (hasStateChanged.current) {
            const fetchPoints = async () => {
                try {
                    await axios.post("http://localhost:3001/api/answers", {
                        p: points / 2,
                        u: props.user,
                        a: JSON.stringify(answers),
                        i: JSON.stringify(images),
                        c: JSON.stringify(canswers),
                    });
                } catch (e) {
                    console.log(e);
                }
            };
            fetchPoints();
        }
    }, [check]);

    return (
        <div className="result-container">
            <h1>YOUR FINAL POINTS: {points / 2}</h1>
            <h3>Summary of your game: </h3>
            <ol className="show-result">
                {props.answers.map((a, i) => (
                    <AnswerRow
                        answers={a}
                        cAnswers={props.cAnswers[i]}
                        img={props.img[i + 1].url}
                        key={i}
                        id={i}
                    />
                ))}
            </ol>
            <div className="btn-container">
                <Link className="play-btn" to={`/`}>
                    Home
                </Link>
                <Link className="play-btn" to={`/images/${randomNumber[0]}`}>
                    Play again
                </Link>
            </div>
        </div>
    );
}

function AnswerRow(props) {
    return (
        <li className="main-opt" id={props.id}>
            <img
                className="image-question"
                src={"http://localhost:3001/" + props.img}
            />
            <p>
                <span className="bold">Your choice:</span> {props.answers}
            </p>
            <p className="bold">Correct answers: </p>
            <ul>
                <li>{props.cAnswers[0].text}</li>
                <li>{props.cAnswers[1].text}</li>
            </ul>
        </li>
    );
}
