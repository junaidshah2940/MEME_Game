// import
import express from "express";
import morgan from "morgan";
import cors from "cors";
import {
    listQuestions,
    getQuestion,
    listImages,
    getImage,
    listAnswers,
} from "./dao.mjs";
import { getUser } from "./user-dao.mjs";

import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import sqlite from "sqlite3";

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));

passport.use(
    new LocalStrategy(async function verify(username, password, cb) {
        const user = await getUser(username, password);
        if (!user) return cb(null, false, "Incorrect username or password.");

        return cb(null, user);
    })
);

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: "Not authorized" });
};

app.use(
    session({
        secret: "shhhhh... it's a secret!",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.authenticate("session"));

app.get("/api/questions", (request, response) => {
    listQuestions()
        .then((questions) => response.json(questions))
        .catch(() => response.status(500).end());
});

const db = new sqlite.Database("mydatabase.db", (err) => {
    if (err) throw err;
});

app.get("/api/images", (request, response) => {
    listImages()
        .then((images) => response.json(images))
        .catch(() => response.status(500).end());
});

app.get("/api/questions/:id", async (req, res) => {
    try {
        const question = await getQuestion(req.params.id);
        if (question.error) res.status(404).json(question);
        else res.json(question);
    } catch {
        res.status(500).end();
    }
});

app.get("/api/images/:id", async (req, res) => {
    try {
        const image = await getImage(req.params.id);
        if (image.error) res.status(404).json(image);
        else res.json(image);
    } catch {
        res.status(500).end();
    }
});

app.get("/api/answers/:user", async (req, res) => {
    try {
        const answers = await listAnswers(req.params.user);
        if (answers.error) res.status(404).json(answers);
        else res.json(answers);
    } catch {
        res.status(500).end();
    }
});

app.post("/api/answers", async (req, res) => {
    const { p, u, a, i, c } = req.body;
    const points = {
        points: p,
        user: u,
        answers: a,
        images: i,
        canswers: c,
    };
    console.log(points);

    const sql =
        "INSERT INTO answer (text, userId, urls, canswer, answer) VALUES (?, ?, ?, ?, ?)";
    db.run(
        sql,
        [
            points.points,
            points.user,
            points.images,
            points.canswers,
            points.answers,
        ],
        (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error saving points");
            } else {
                res.status(200).send("Points saved successfully");
            }
        }
    );
});

app.post("/api/sessions", function (req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).send(info);
        }
        req.login(user, (err) => {
            if (err) return next(err);

            return res.status(201).json(req.user);
        });
    })(req, res, next);
});

app.get("/api/sessions/current", (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else res.status(401).json({ error: "Not authenticated" });
});

app.delete("/api/sessions/current", (req, res) => {
    req.logout(() => {
        res.end();
    });
});

app.listen(port, () => {
    console.log(`API server started at http://localhost:${port}`);
});
