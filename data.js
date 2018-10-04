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

  medal = medal ? `and r.medal = ${medal}` : ``;

  let sql = `select year Year, res.num Amount
             from games left outer join
               (select g.id id, count(r.medal) num from games g
               join results r on (g.id = r.game_id)
               join athletes a on (r.athlete_id = a.id)
               join teams t on (a.team_id = t.id)
               where season = ${season}
               and t.noc_name = '${noc}'
               ${medal}
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
