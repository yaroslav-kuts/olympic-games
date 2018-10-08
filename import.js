const queries = require('./libs/queries');
const data = require('./libs/data');

const dropGamesIndex = data.run(queries.dropGamesIndex, `Games index has been droped!`);

const dropSportsIndex = data.run(queries.dropSportsIndex, `Sports index has been droped!`);

const dropEventsIndex = data.run(queries.dropEventsIndex, `Events index has been droped!`);

const dropAthletesIndex = data.run(queries.dropAthletesIndex, `Athletes index has been droped!`);

const castSeasonToEnum = data.run(queries.seasonToEnumQuery, `Season column of temp table casted to enum!`);

const createGamesIndex = data.run(queries.createGamesIndexQuery, `Index in games table was created!`);

const createEventsIndex = data.run(queries.createEventsIndexQuery, `Index in games table was created!`);

const createSportsIndex = data.run(queries.createSportsIndexQuery, `Index in sports table was created!`);

const createAthletesIndex = data.run(queries.createAthletesIndexQuery, `Index in athletes table was created!`);

const removeUnofficialYearRecords = data.run(queries.removeUnofficialYearRecordsQuery, `Records with 1906 year were truncated!`);

const cleanSports = data.run(queries.cleanSportsTable, `'Sports' table was truncated!`);

const cleanEvents = data.run(`delete from events`, `'Events' table was truncated!`);

const cleanTeams = data.run(`delete from teams`, `'Teams' table was truncated!`);

const cleanAthletes = data.run(`delete from athletes`, `'Athletes' table was truncated!`);

const cleanGames = data.run(`delete from games`, `'Games' table was truncated!`);

const cleanResults = data.run(`delete from results`, `'Results' table was truncated!`);

const fillSportsTable = data.run(queries.fillSportsQuery, `'Sports' table has been fulfilled!`);

const fillEventsTable = data.run(queries.fillEventsQuery, `'Events' table has been fulfilled!`);

const fillTeamsTable = data.run(queries.fillTeamsQuery, `'Teams' table has been fulfilled!`);

const fillGamesTable = data.run(queries.fillGamesQuery, `'Games' table has been fulfilled!`);

const resolveMultiCityProblem = data.run(queries.multiCityProblemQuery, `Multi city problem has been resolved!`);

const removeDuplicatesGames = data.run(queries.removeDuplicatesQuery, `Duplicate games has been removed!`);

const fillResulsTable = data.run(queries.fillResulsQuery, `'Results' table has been fullfilled!`);

const fillAthletesTable = data.run(queries.fillAthletesQuery, `'Athletes' table has been fulfilled!`);

const removeTemp = data.run(`drop table temp`, `'Temp' table was removed!`);

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
  .catch((err) => { console.log(err.message); });

data.close();
