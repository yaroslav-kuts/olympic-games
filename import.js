var sqlite3 = require('sqlite3');
var queries = require('./libs/queries');
var data = require('./libs/data');

let db = data.getConnection();

var promisifyQuery = function (query, args, message) {
  return () => {
    return new Promise((resolve, reject) => {
      db.run(query, args, function (err) {
        if (err) {
          console.log(`Query:\n'${query}'\n caused: ${err.message}`);
          reject();
        }
        if (message) console.log(message);
        resolve();
      });
    });
  };
};

var dropGamesIndex = promisifyQuery(queries.dropGamesIndex, [], `Games index has been droped!`);

var dropSportsIndex = promisifyQuery(queries.dropSportsIndex, [], `Sports index has been droped!`);

var dropEventsIndex = promisifyQuery(queries.dropEventsIndex, [], `Events index has been droped!`);

var dropAthletesIndex = promisifyQuery(queries.dropAthletesIndex, [], `Athletes index has been droped!`);

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

var resolveMultiCityProblem = promisifyQuery(queries.multiCityProblemQuery, [], `Multi city problem has been resolved!`);

var removeDuplicatesGames = promisifyQuery(queries.removeDuplicatesQuery, [], 'Duplicate games has been removed!');

var fillResulsTable = promisifyQuery(queries.fillResulsQuery, [], `'Results' table has been fullfilled!`);

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
  .then(() => { return removeDuplicatesGames(); })
  .then(() => { return createSportsIndex(); })
  .then(() => { return createEventsIndex(); })
  .then(() => { return createGamesIndex(); })
  .then(() => { return createAthletesIndex(); })
  .then(() => { return castSeasonToEnum(); })
  .then(() => { return fillResulsTable(); })
  .then(() => { return dropGamesIndex(); })
  .then(() => { return dropSportsIndex(); })
  .then(() => { return dropEventsIndex(); })
  .then(() => { return dropAthletesIndex(); })
  .then(() => { return removeTemp(); })
  .then(() => { return data.prettifyName(); })
  .then(() => { console.log('Data was imported to DB!'); });

db.close();
