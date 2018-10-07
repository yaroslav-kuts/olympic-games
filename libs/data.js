var sqlite3 = require('sqlite3');
var queries = require('./queries');

const DB = './data/olympic_history.db';

var getConnection = function () {
  return new sqlite3.Database(DB);
}

var getNOCs = function (callback) {
  // let db = new sqlite3.Database('./olympic_history.db');
  var db = getConnection();

  var sql = `select id, noc_name from teams`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows);
  });

  db.close();
};

var getAmountOfMedals = function (season, noc, medal, callback) {
  //let db = new sqlite3.Database('./olympic_history.db');
  var db = getConnection();

  medal = medal ? `= ${medal}` : ` > 0`;

  var sql = `select year Year, res.num Amount
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
    rows = rows.map(row => [row.Year, row.Amount || 0]);
    callback(rows);
  });

  db.close();
};

var getTopTeams = function (season, year, medal, callback) {
  // let db = new sqlite3.Database('./olympic_history.db');
  var db = getConnection();

  year = year ? `and g.year = ${year}` : ``;
  medal = medal ? `= ${medal}` : ` > 0`;

  var sql = `select t.noc_name NOC, count(r.medal) Amount from results r
             join games g on (r.game_id = g.id)
             join athletes a on (r.athlete_id = a.id)
             join teams t on (a.team_id = t.id)
             where g.season = ${season}
             ${year}
             and r.medal ${medal}
             group by t.id
             having Amount >
             (select round(avg(num)) from
               (select count(r.medal) num from results r
                join games g on (r.game_id = g.id)
                join athletes a on (r.athlete_id = a.id)
                join teams t on (a.team_id = t.id)
                where g.season = ${season}
                ${year}
                and r.medal ${medal}
                group by t.id))
             order by Amount desc;`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows = rows.map(row => [row.NOC, row.Amount || 0]);
    callback(rows);
  });

  db.close();
};

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
exports.getNOCs = getNOCs;
exports.getAmountOfMedals = getAmountOfMedals;
exports.getTopTeams = getTopTeams;
exports.prettifyName = prettifyName;

exports.run = run;
