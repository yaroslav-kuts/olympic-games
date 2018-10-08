const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./data/olympic_history.db');

const all = function (query) {
  return () => {
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          err.message = (`Query:\n'${query}'\n caused: ${err.message}`);
          reject(err);
        }
        resolve(rows);
      });
    });
  };
};

const run = function (query, message) {
  return () => {
    return new Promise((resolve, reject) => {
      db.run(query, [], function (err) {
        if (err) {
          err.message = (`Query:\n'${query}'\n caused: ${err.message}`);
          reject(err);
        }
        if (message) console.log(message);
        resolve();
      });
    });
  };
};

const close = () => db.close();

exports.run = run;
exports.all = all;
exports.close = close;
