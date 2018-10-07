let queries = require('./libs/queries');
let data = require('./libs/data');

let dropGamesIndex = data.run(queries.dropGamesIndex, [], `Games index has been droped!`);

let dropSportsIndex = data.run(queries.dropSportsIndex, [], `Sports index has been droped!`);

let dropEventsIndex = data.run(queries.dropEventsIndex, [], `Events index has been droped!`);

let dropAthletesIndex = data.run(queries.dropAthletesIndex, [], `Athletes index has been droped!`);

let castSeasonToEnum = data.run(queries.seasonToEnumQuery, [], `Season column of temp table casted to enum!`);

let createGamesIndex = data.run(queries.createGamesIndexQuery, [], `Index in games table was created!`);

let createEventsIndex = data.run(queries.createEventsIndexQuery, [], `Index in games table was created!`);

let createSportsIndex = data.run(queries.createSportsIndexQuery, [], `Index in sports table was created!`);

let createAthletesIndex = data.run(queries.createAthletesIndexQuery, [], `Index in athletes table was created!`);

let removeUnofficialYearRecords = data.run(queries.removeUnofficialYearRecordsQuery, [], `Records with 1906 year were truncated!`);

let cleanSports = data.run(queries.cleanSportsTable, [], `'Sports' table was truncated!`);

let cleanEvents = data.run(`delete from events`, [], `'Events' table was truncated!`);

let cleanTeams = data.run(`delete from teams`, [], `'Teams' table was truncated!`);

let cleanAthletes = data.run(`delete from athletes`, [], `'Athletes' table was truncated!`);

let cleanGames = data.run(`delete from games`, [], `'Games' table was truncated!`);

let cleanResults = data.run(`delete from results`, [], `'Results' table was truncated!`);

let fillSportsTable = data.run(queries.fillSportsQuery, [], `'Sports' table has been fulfilled!`);

let fillEventsTable = data.run(queries.fillEventsQuery, [], `'Events' table has been fulfilled!`);

let fillTeamsTable = data.run(queries.fillTeamsQuery, [], `'Teams' table has been fulfilled!`);

let fillGamesTable = data.run(queries.fillGamesQuery, [], `'Games' table has been fulfilled!`);

let resolveMultiCityProblem = data.run(queries.multiCityProblemQuery, [], `Multi city problem has been resolved!`);

let removeDuplicatesGames = data.run(queries.removeDuplicatesQuery, [], 'Duplicate games has been removed!');

let fillResulsTable = data.run(queries.fillResulsQuery, [], `'Results' table has been fullfilled!`);

let fillAthletesTable = data.run(queries.fillAthletesQuery, [], `'Athletes' table has been fulfilled!`);

let removeTemp = data.run(`drop table temp`, [], `'Temp' table was removed!`);

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
