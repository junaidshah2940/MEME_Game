import { Link } from "react-router-dom";

function Homepage(props) {
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

    const loggedIn = props.loggedIn;
    const randomNumber = getUniqueRandomNumbers(1, 50, 5);
    return (
        <div className="home-container">
            <h1 className="greating-heading">
                Welcome to the best page for playing!
            </h1>
            <p className="greating-content">
                Get Your Laugh On: Play the Ultimate Meme Game!
            </p>
            <p className="greating-content">
                The faster you caption, the funnier you get. Let's meme!
            </p>
            <ul>
                <li>
                    <Link
                        className="play-btn"
                        to={`./images/${randomNumber[0]}`}
                    >
                        Play Now
                    </Link>
                    <Link className="play-btn" to={`./history`}>
                        Statistics
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export { Homepage };
