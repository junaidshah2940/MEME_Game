import { useEffect, useState } from "react";

export default function Timer(props) {
    const [counter, setCounter] = useState(30);
    const [count, setCount] = useState(0);

    if (props.loggedIn) {
        useEffect(() => {
            setCounter(30);
            setCount(count + 1);
        }, [props.checkClick]);

        useEffect(() => {
            const timerId = setInterval(() => {
                if (counter > 1) {
                    setCounter(counter - 1);
                } else {
                    setCounter(30);
                    setCount(count + 1);
                    if (count == 2) {
                        props.handleCheck(undefined);
                    }
                }
            }, 1000);

            return () => clearInterval(timerId);
        }, [counter]);
    } else {
        useEffect(() => {
            setCounter(30);
        }, []);

        useEffect(() => {
            const timerId = setInterval(() => {
                if (counter > 1) {
                    setCounter(counter - 1);
                }
            }, 1000);

            return () => clearInterval(timerId);
        }, [counter]);
    }
    return (
        <div className="timer-container">
            <h1>Countdown: {counter}</h1>
        </div>
    );
}
