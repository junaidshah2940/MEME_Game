import sqlite from "sqlite3";

export const db = new sqlite.Database("mydatabase.db", (err) => {
    if (err) throw err;
});
