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

var getAmountOfMedals = function (season, noc, medal, callback) {
  let db = new sqlite3.Database('./olympic_history.db');

  medal = medal ? `= ${medal}` : ` > 0`;

  let sql = `select year Year, res.num Amount
            from games left outer join
              (select g.id, count(r.medal) num from results r
              join games g on (r.game_id = g.id)
              join athletes a on (r.athlete_id = a.id)
              join teams t on (a.team_id = t.id)
              where g.season = ${season}
              and t.noc_name = '${noc}'
              and r.medal ${medal}
              group by g.year) res
            on (games.id = res.id) order by year`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows);
  });

  db.close();
};

exports.getNOCs = getNOCs;
exports.getAmountOfMedals = getAmountOfMedals;
