import { Link, useParams } from "react-router-dom";

export default function ResultHistory(props) {
    const params = useParams();
    const id = params.id;

    const userInfo = props.answersUser[id];
    const img = JSON.parse(userInfo.urls);
    const canswers = JSON.parse(userInfo.canswer);
    const answers = JSON.parse(userInfo.answer);

    return (
        <div className="result-container">
            <h1>YOUR FINAL POINTS: {userInfo.text}</h1>
            <h3>Summary of your game: </h3>
            <ol className="show-result">
                {img.map((a, i) => (
                    <AnswerRow
                        answers={answers[i].el}
                        cAnswers={canswers[i]}
                        img={a}
                        key={i}
                        id={i}
                    />
                ))}
            </ol>
            <Link className="play-btn" to={"/"}>
                Back
            </Link>
        </div>
    );
}

function AnswerRow(props) {
    return (
        <li className="main-opt" id={props.id}>
            <img
                className="image-question"
                src={"http://localhost:3001/" + props.img[0]}
            />
            <p>
                <span className="bold">Your choice:</span> {props.answers}
            </p>
            <p className="bold">Correct answers: </p>
            <ul>
                <li>{props.cAnswers[0]}</li>
                <li>{props.cAnswers[1]}</li>
            </ul>
        </li>
    );
}
