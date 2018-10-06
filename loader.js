var sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./data/olympic_history.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the "olympic_history" database.');
});

var removeUnofficialYearRecords = () => {
  return new Promise((resolve, reject) => {
    db.run(`delete from temp where year = 1906;`, [], function (err) {
      if (err) console.error(err.message);
      console.log(`Records with 1906 year were truncated!`);
      resolve();
    });
  });
};

var cleanSports = () => {
  return new Promise((resolve, reject) => {
    db.run(`delete from sports`, [], function (err) {
      if (err) console.error(err.message);
      console.log(`'Sports' table was truncated!`);
      resolve();
    });
  });
};

var cleanEvents = () => {
  return new Promise((resolve, reject) => {
    db.run(`delete from events`, [], function (err) {
      if (err) console.error(err.message);
      console.log(`'Events' table was truncated!`);
      resolve();
    });
  });
};

var cleanTeams = () => {
  return new Promise((resolve, reject) => {
    db.run(`delete from teams`, [], function (err) {
      if (err) console.error(err.message);
      console.log(`'Teams' table was truncated!`);
      resolve();
    });
  });
};

var cleanAthletes = () => {
  return new Promise((resolve, reject) => {
    db.run(`delete from athletes`, [], function (err) {
      if (err) console.error(err.message);
      console.log(`'Athletes' table was truncated!`);
      resolve();
    });
  });
};

var cleanGames = () => {
  return new Promise((resolve, reject) => {
    db.run(`delete from games`, [], function (err) {
      if (err) console.error(err.message);
      console.log(`'Games' table was truncated!`);
      resolve();
    });
  });
};

var cleanResults = () => {
  return new Promise((resolve, reject) => {
    db.run(`delete from results`, [], function (err) {
      if (err) console.error(err.message);
      console.log(`'Results' table was truncated!`);
      resolve();
    });
  });
};

var fillSportsTable = () => {
  return new Promise((resolve, reject) => {
    var fillSportsSQL = `insert into sports (name) select distinct sport from temp where sport is not null`;

    db.run(fillSportsSQL, [], function (err) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      console.log(`'Sports' table has been fulfilled!`);
      resolve();
    });
  });
};

var fillEventsTable = () => {
  return new Promise((resolve, reject) => {
    var fillEventsSQL = `insert into events (name) select distinct event from temp where event is not null`;

    db.run(fillEventsSQL, [], function (err) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      console.log(`'Events' table has been fulfilled!`);
      resolve();
    });
  })
};

var fillTeamsTable = () => {
  return new Promise((resolve, reject) => {
    var fillTeamsSQL = `insert into teams (name, noc_name) select team, NOC from temp group by NOC`;

    db.run(fillTeamsSQL, [], function (err) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      console.log(`'Teams' table has been fulfilled!`);
      resolve();
    });
  });
};

var fillGamesTable = () => {
  return new Promise((resolve, reject) => {
    var fillGamesSQL = `insert into games (year, season, city)
                     select year, season, city from
                     (select distinct games, year,
                     case season
                       when 'Summer' then 0
                       when 'Winter' then 1
                       else NULL
                     end season,
                     city from temp where year is not null and year <> 1906)`;

    db.run(fillGamesSQL, [], function (err) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      console.log(`'Games' table has been fulfilled!`);
      resolve();
    });
  });
};

var resolveMultiCityProblem = () => {
  return new Promise((resolve, reject) => {
    var multiCityProblemSQL = `update games set city = 'Melbourne, Stockholm' where year = 1956 and season = 0`;

    db.run(multiCityProblemSQL, [], function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);

      var removeDuplicatesSQL = `delete from games where id = (select id from games where year = 1956 and season = 0 limit 1)`;

      db.run(removeDuplicatesSQL, [], function (err) {
        if (err) {
          console.error(err.message);
        }
        console.log(`Row(s) deleted: ${this.changes}`);
        console.log(`Multi city problem in 'Games' table was resolved!`);
        resolve();
      });
    });
  });
};

var fillResulsTable = () => {
  return new Promise((resolve, reject) => {
    var fillResulsSQL = `insert into results
                         (athlete_id, game_id, sport_id, event_id, medal)
                         select
                           (select id from athletes where athletes.full_name = temp.name) name,
                           (select id from games where games.year = temp.year) game,
                           (select id from sports where sports.name = temp.sport) sport,
                           (select id from events where events.name = temp.event) event,
                           case medal
                             when 'Gold' then 1
                             when 'Silver' then 2
                             when 'Bronze' then 3
                             else 0
                           end medal
                         from temp`;

    db.run(fillResulsSQL, [], function (err) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      console.log(`'Results' table has been fullfilled!`);
      resolve();
    });
  });
};

var prettifyName = () => {
  return new Promise((resolve, reject) => {
    var toAdjustSQL = `select id, full_name from athletes where full_name like '%(%)%' or full_name like '%"%"%'`;

    db.all(toAdjustSQL, [], (err, rows) => {
      if (err) {
        throw err;
      }

      console.log(`Names to prettify: ${rows.length}`);

      rows.forEach((row) => {
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
  });
};

var fillAthletesTable = () => {
  return new Promise((resolve, reject) => {
    var fillAthletesSQL = `insert into athletes (full_name, age, sex, params, team_id)
                        select distinct temp.name n, temp.sex s, temp.age a,
                        case
                          when temp.height <> 'NA' and temp.height is not NULL and temp.weight <> 'NA' and temp.weight is not NULL then '{ "height": "' || temp.height || '", "weight": "' || temp.weight || '" }'
                          when temp.height <> 'NA' and temp.height is not NULL then '{ "height": "' || temp.height || '" }'
                          when temp.weight <> 'NA' and temp.weight is not NULL then '{ "weight": "' || temp.weight || '" }'
                          else '{ }'
                        end h, t.id
                        from temp join teams t on (temp.NOC = t.noc_name) group by temp.name`;

    db.run(fillAthletesSQL, [], function (err) {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      console.log(`'Athletes' table has been fulfilled!`);
      resolve();
    });
  });
};

var removeTemp = () => {
  return new Promise((resolve, reject) => {
    db.run(`drop table temp`, [], function (err) {
      if (err) console.log(err.message);
      console.log(`'Temp' table was removed!`);
      resolve();
    });
  });
};

removeUnofficialYearRecords()
  .then(() => { return cleanResults(); })
  .then(() => { return cleanGames(); })
  .then(() => { return cleanAthletes(); })
  .then(() => { return cleanTeams(); })
  .then(() => { return cleanEvents(); })
  .then(() => { return cleanSports(); })
  .then(() => { return fillSportsTable(); })
  .then(() => { return fillEventsTable(); })
  .then(() => { return fillTeamsTable(); })
  .then(() => { return fillAthletesTable(); })
  .then(() => { return fillGamesTable(); })
  .then(() => { return resolveMultiCityProblem(); })
  .then(() => { return fillResulsTable(); })
  .then(() => { return removeTemp(); })
  .then(() => { return prettifyName(); })
  .then(() => { console.log('Data was loaded to DB!'); });

db.close();
