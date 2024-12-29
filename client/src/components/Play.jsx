import { Link } from "react-router-dom";

export default function Play() {
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
    const r = getUniqueRandomNumbers(1, 50, 1);

    return (
        <div className="play-btn-container">
            <div>
                <p>Test your meme mastery in this hilarious game!</p>
                <p>
                    Can you caption the classics and become the meme champion?
                    Play now!
                </p>
                <Link className="play-btn" to={`./unauth/${r}`}>
                    Play Now
                </Link>
            </div>
        </div>
    );
}
