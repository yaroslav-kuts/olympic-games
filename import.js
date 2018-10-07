var queries = require('./libs/queries');
var data = require('./libs/data');

var dropGamesIndex = data.run(queries.dropGamesIndex, [], `Games index has been droped!`);

var dropSportsIndex = data.run(queries.dropSportsIndex, [], `Sports index has been droped!`);

var dropEventsIndex = data.run(queries.dropEventsIndex, [], `Events index has been droped!`);

var dropAthletesIndex = data.run(queries.dropAthletesIndex, [], `Athletes index has been droped!`);

var castSeasonToEnum = data.run(queries.seasonToEnumQuery, [], `Season column of temp table casted to enum!`);

var createGamesIndex = data.run(queries.createGamesIndexQuery, [], `Index in games table was created!`);

var createEventsIndex = data.run(queries.createEventsIndexQuery, [], `Index in games table was created!`);

var createSportsIndex = data.run(queries.createSportsIndexQuery, [], `Index in sports table was created!`);

var createAthletesIndex = data.run(queries.createAthletesIndexQuery, [], `Index in athletes table was created!`);

var removeUnofficialYearRecords = data.run(queries.removeUnofficialYearRecordsQuery, [], `Records with 1906 year were truncated!`);

var cleanSports = data.run(queries.cleanSportsTable, [], `'Sports' table was truncated!`);

var cleanEvents = data.run(`delete from events`, [], `'Events' table was truncated!`);

var cleanTeams = data.run(`delete from teams`, [], `'Teams' table was truncated!`);

var cleanAthletes = data.run(`delete from athletes`, [], `'Athletes' table was truncated!`);

var cleanGames = data.run(`delete from games`, [], `'Games' table was truncated!`);

var cleanResults = data.run(`delete from results`, [], `'Results' table was truncated!`);

var fillSportsTable = data.run(queries.fillSportsQuery, [], `'Sports' table has been fulfilled!`);

var fillEventsTable = data.run(queries.fillEventsQuery, [], `'Events' table has been fulfilled!`);

var fillTeamsTable = data.run(queries.fillTeamsQuery, [], `'Teams' table has been fulfilled!`);

var fillGamesTable = data.run(queries.fillGamesQuery, [], `'Games' table has been fulfilled!`);

var resolveMultiCityProblem = data.run(queries.multiCityProblemQuery, [], `Multi city problem has been resolved!`);

var removeDuplicatesGames = data.run(queries.removeDuplicatesQuery, [], 'Duplicate games has been removed!');

var fillResulsTable = data.run(queries.fillResulsQuery, [], `'Results' table has been fullfilled!`);

var fillAthletesTable = data.run(queries.fillAthletesQuery, [], `'Athletes' table has been fulfilled!`);

var removeTemp = data.run(`drop table temp`, [], `'Temp' table was removed!`);

cleanResults()
  .then(cleanGames)
  .then(cleanAthletes)
  .then(cleanTeams)
  .then(cleanEvents)
  .then(cleanSports)
  .then(fillTeamsTable)
  .then(removeUnofficialYearRecords)
  .then(fillSportsTable)
  .then(fillEventsTable)
  .then(fillAthletesTable)
  .then(fillGamesTable)
  .then(resolveMultiCityProblem)
  .then(removeDuplicatesGames)
  .then(createSportsIndex)
  .then(createEventsIndex)
  .then(createGamesIndex)
  .then(createAthletesIndex)
  .then(castSeasonToEnum)
  .then(fillResulsTable)
  .then(dropGamesIndex)
  .then(dropSportsIndex)
  .then(dropEventsIndex)
  .then(dropAthletesIndex)
  .then(removeTemp)
  .then(data.prettifyName)
  .then(() => { console.log('Data was imported to DB!'); })
  .catch(() => { console.log(err.message); });
