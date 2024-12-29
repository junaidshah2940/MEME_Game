import { Question, Image, Answer } from "./QAModels.mjs";

const SERVER_URL = "http://localhost:3001";

const getQuestions = async () => {
    const response = await fetch(SERVER_URL + "/api/questions");
    if (response.ok) {
        const questionsJson = await response.json();
        return questionsJson.map(
            (q) => new Question(q.id, q.text, q.email, q.date, q.imageId)
        );
    } else throw new Error("Internal server error");
};

const getImages = async () => {
    const response = await fetch(SERVER_URL + "/api/images");
    if (response.ok) {
        const imagesJson = await response.json();
        return imagesJson.map((i) => new Image(i.id, i.url, i.date));
    } else throw new Error("Internal server error");
};

const getImagesAnswers = async (id) => {
    const response = await fetch(SERVER_URL + `/api/images/${id}`);
    if (response.ok) {
        const imagesJson = await response.json();
        return imagesJson.map(
            (i) => new Image(i.id, i.url, i.date, i.text, i.email)
        );
    } else throw new Error("Internal server error");
};

const getAnswers = async (user) => {
    const response = await fetch(SERVER_URL + "/api/answers/" + user);
    if (response.ok) {
        const answersJson = await response.json();
        return answersJson.map(
            (a) =>
                new Answer(a.id, a.text, a.userId, a.urls, a.canswer, a.answer)
        );
    } else throw new Error("Internal server error");
};

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + "/api/sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

// NEW
const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
        credentials: "include",
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user; // an object with the error coming from the server
    }
};

// NEW
const logOut = async () => {
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
        method: "DELETE",
        credentials: "include",
    });
    if (response.ok) return null;
};

const API = {
    getQuestions,
    getImages,
    getImagesAnswers,
    logIn,
    logOut,
    getUserInfo,
    getAnswers,
};
export default API;
