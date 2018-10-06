var sqlite3 = require('sqlite3');
var queries = require('./libs/queries');

var promisifyQuery = function (query, args, message) {
  return () => {
    return new Promise((resolve, reject) => {
      db.run(query, args, function (err) {
        if (err) {
          console.log(`'${query}' causes: ${err.message}`);
          reject();
        }
        if (message) console.log(message);
        resolve();
      });
    });
  };
};


let db = new sqlite3.Database('./data/olympic_history.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the "olympic_history" database.');
});

var dropIndexes = () => {
  return new Promise((resolve, reject) => {
    db.run(queries.dropGamesIndex);
    db.run(queries.dropSportsIndex);
    db.run(queries.dropEventsIndex);
    db.run(queries.dropAthletesIndex);
    resolve();
  });
};

var castSeasonToEnum = promisifyQuery(queries.seasonToEnumQuery, [], `Season column of temp table casted to enum!`);

var createGamesIndex = promisifyQuery(queries.createGamesIndexQuery, [], `Index in games table was created!`);

var createEventsIndex = promisifyQuery(queries.createEventsIndexQuery, [], `Index in games table was created!`);

var createSportsIndex = promisifyQuery(queries.createSportsIndexQuery, [], `Index in sports table was created!`);

var createAthletesIndex = promisifyQuery(queries.createAthletesIndexQuery, [], `Index in athletes table was created!`);

var removeUnofficialYearRecords = promisifyQuery(queries.removeUnofficialYearRecordsQuery, [], `Records with 1906 year were truncated!`);

var cleanSports = promisifyQuery(queries.cleanSportsTable, [], `'Sports' table was truncated!`);

var cleanEvents = promisifyQuery(`delete from events`, [], `'Events' table was truncated!`);

var cleanTeams = promisifyQuery(`delete from teams`, [], `'Teams' table was truncated!`);

var cleanAthletes = promisifyQuery(`delete from athletes`, [], `'Athletes' table was truncated!`);

var cleanGames = promisifyQuery(`delete from games`, [], `'Games' table was truncated!`);

var cleanResults = promisifyQuery(`delete from results`, [], `'Results' table was truncated!`);

var fillSportsTable = promisifyQuery(queries.fillSportsQuery, [], `'Sports' table has been fulfilled!`);

var fillEventsTable = promisifyQuery(queries.fillEventsQuery, [], `'Events' table has been fulfilled!`);

var fillTeamsTable = promisifyQuery(queries.fillTeamsQuery, [], `'Teams' table has been fulfilled!`);

var fillGamesTable = promisifyQuery(queries.fillGamesQuery, [], `'Games' table has been fulfilled!`);

var resolveMultiCityProblem = () => {
  return new Promise((resolve, reject) => {

    db.run(queries.multiCityProblemQuery, [], function (err) {
      if (err) {
        console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
      db.run(queries.removeDuplicatesQuery, [], function (err) {
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

var fillResulsTable = promisifyQuery(queries.fillResulsQuery, [], `'Results' table has been fullfilled!`);

var prettifyName = () => {
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
};

var fillAthletesTable = promisifyQuery(queries.fillAthletesQuery, [], `'Athletes' table has been fulfilled!`);

var removeTemp = promisifyQuery(`drop table temp`, [], `'Temp' table was removed!`);

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
  .then(() => { return createSportsIndex(); })
  .then(() => { return createEventsIndex(); })
  .then(() => { return createGamesIndex(); })
  .then(() => { return createAthletesIndex(); })
  .then(() => { return castSeasonToEnum(); })
  .then(() => { return fillResulsTable(); })
  .then(() => { return dropIndexes(); })
  .then(() => { return removeTemp(); })
  // .then(() => { return prettifyName(); })
  .then(() => { console.log('Data was imported to DB!'); });

db.close();
