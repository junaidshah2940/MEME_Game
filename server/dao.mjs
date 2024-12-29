/* Data Access Object (DAO) module for accessing Q&A */

import sqlite from "sqlite3";
import { Question, Image, Answer } from "./QAModels.mjs";

const db = new sqlite.Database("mydatabase.db", (err) => {
    if (err) throw err;
});

/** QUESTIONS **/
// get all the questions
export const listQuestions = () => {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT question.*, user.email FROM question JOIN user ON question.authorId = user.id";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const questions = rows.map(
                    (q) =>
                        new Question(q.id, q.text, q.email, q.date, q.imageId)
                );
                resolve(questions);
            }
        });
    });
};

// get a question given its id
export const getQuestion = (id) => {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT question.*, user.email FROM question JOIN user ON question.authorId = user.id WHERE question.id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else if (row === undefined)
                resolve({
                    error: "Question not available, check the inserted id.",
                });
            else {
                resolve(
                    new Question(
                        row.id,
                        row.text,
                        row.email,
                        row.date,
                        row.imageId
                    )
                );
            }
        });
    });
};

/** Images **/
// get all the images
export const listImages = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM image";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else {
                const images = rows.map(
                    (image) => new Image(image.id, image.url, image.date)
                );
                resolve(images);
            }
        });
    });
};

// get an image given its id
export const getImage = (id) => {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT i.*, q.text FROM image AS i INNER JOIN question AS q ON q.imageId = i.id WHERE i.id = ?";
        db.all(sql, [id], (err, row) => {
            if (err) reject(err);
            else if (row === undefined)
                resolve({
                    error: "Question not available, check the inserted id.",
                });
            else {
                const images = row.map(
                    (image) =>
                        new Image(
                            image.id,
                            image.url,
                            image.date,
                            image.text,
                            image.email
                        )
                );
                resolve(images);
            }
        });
    });
};

/** Answers **/
// get all the answers
export const listAnswers = (user) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM answer WHERE userId = ?";
        db.all(sql, [user], (err, rows) => {
            if (err) reject(err);
            else {
                const answers = rows.map(
                    (a) =>
                        new Answer(
                            a.id,
                            a.text,
                            a.userId,
                            a.urls,
                            a.canswer,
                            a.answer
                        )
                );
                resolve(answers);
            }
        });
    });
};
