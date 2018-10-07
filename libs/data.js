var sqlite3 = require('sqlite3');
var queries = require('./queries');

const DB = './data/olympic_history.db';

var getConnection = function () {
  return new sqlite3.Database(DB);
}

var prettifyName = () => {
  let db = getConnection();

  return new Promise((resolve, reject) => {
    db.each(queries.getNamesToAdjust, [], (err, row) => {
      if (err) {
        throw err;
      }

      var prettyName = row.full_name.replace(/(\(.*?\)|\".*?\"|\")( )?/g, '').trim();
      var adjustNameSQL = `update athletes set full_name = "${prettyName}" where id = ${row.id}`;

      db.run(adjustNameSQL, [], function (err) {
        if (err) {
          console.log(adjustNameSQL);
          console.error(err.message);
        }
      });
    });
  });
  db.close();
};

var all = function (query, args) {
  return () => {
    return new Promise((resolve, reject) => {
      let db = getConnection();
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

var run = function (query, args, message) {
  return () => {
    return new Promise((resolve, reject) => {
      let db = getConnection();
      db.run(query, args, function (err) {
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

exports.getConnection = getConnection;

exports.prettifyName = prettifyName;

exports.run = run;
exports.all = all;
