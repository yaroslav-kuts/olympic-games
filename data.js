var sqlite3 = require('sqlite3');

var getNOCs = function (callback) {
  let db = new sqlite3.Database('./olympic_history.db');

  let sql = `select id, noc_name from teams`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows);
  });

  db.close();
};

exports.getNOCs = getNOCs;
