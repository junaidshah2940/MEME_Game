import { useNavigate } from "react-router-dom";

function History(props) {
    const loggedIn = props.loggedIn;
    return (
        <div className="history-container">
            <h1 className="greating-heading">Dear {props.user}</h1>
            <p className="greating-content">Result of your game:</p>
            <dl className="show-result">
                {props.answersUser.map((a, i) => (
                    <AnswerRow key={i} id={i} />
                ))}
            </dl>
        </div>
    );
}

function AnswerRow(props) {
    const navigate = useNavigate();
    const handleClick = (e) => {
        navigate(`/results/${e.target.id}`);
    };
    return (
        <li id={props.id} onClick={handleClick}>
            Game {props.id + 1}
        </li>
    );
}

export { History };
