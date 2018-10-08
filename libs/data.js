const sqlite3 = require('sqlite3');
const queries = require('./queries');

const DB = './data/olympic_history.db';

const prettifyName = () => {
  const db = new sqlite3.Database(DB);;

  return new Promise((resolve, reject) => {
    db.each(queries.getNamesToAdjust, [], (err, row) => {
      if (err) {
        reject(err);
      }

      const prettyName = row.full_name.replace(/(\(.*?\)|\".*?\"|\")( )?/g, '').trim();
      const adjustNameSQL = `update athletes set full_name = "${prettyName}" where id = ${row.id}`;

      db.run(adjustNameSQL, [], function (err) {
        if (err) {
          console.log(adjustNameSQL);
          console.error(err.message);
        }
        resolve();
      });
    });
  });
  db.close();
};

const all = function (query) {
  return () => {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(DB);
      db.all(query, [], (err, rows) => {
        if (err) {
          err.message = (`Query:\n'${query}'\n caused: ${err.message}`);
          reject(err);
        }
        resolve(rows);
      });
      db.close();
    });
  };
};

const run = function (query, message) {
  return () => {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(DB);
      db.run(query, [], function (err) {
        if (err) {
          err.message = (`Query:\n'${query}'\n caused: ${err.message}`);
          reject(err);
        }
        if (message) console.log(message);
        resolve();
      });
      db.close();
    });
  };
};

exports.prettifyName = prettifyName;
exports.run = run;
exports.all = all;
