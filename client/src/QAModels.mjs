/* Same of week 03, but without any internal methods */
import dayjs from "dayjs";

function Question(id, text, email, date, imageId) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.imageId = imageId;
    this.date = dayjs(date);
}

function Image(id, url, date, text, email) {
    this.id = id;
    this.url = url;
    this.date = dayjs(date);
    this.text = text;
    this.email = email;
}

function Answer(id, text, userId, urls, canswer, answer) {
    this.id = id;
    this.text = text;
    this.userId = userId;
    this.urls = urls;
    this.canswer = canswer;
    this.answer = answer;
}

export { Question, Image, Answer };
