const queries = require('./libs/queries');
const db = require('./libs/db');

const dropGamesIndex = db.run(queries.dropGamesIndex, `Games index has been droped.`);

const dropSportsIndex = db.run(queries.dropSportsIndex, `Sports index has been droped.`);

const dropEventsIndex = db.run(queries.dropEventsIndex, `Events index has been droped.`);

const dropAthletesIndex = db.run(queries.dropAthletesIndex, `Athletes index has been droped.`);

const castSeasonToEnum = db.run(queries.seasonToEnumQuery, `Season column of temp table casted to enum.`);

const createGamesIndex = db.run(queries.createGamesIndexQuery, `Index in games table was created.`);

const createEventsIndex = db.run(queries.createEventsIndexQuery, `Index in games table was created.`);

const createSportsIndex = db.run(queries.createSportsIndexQuery, `Index in sports table was created.`);

const createAthletesIndex = db.run(queries.createAthletesIndexQuery, `Index in athletes table was created.`);

const removeUnofficialYearRecords = db.run(queries.removeUnofficialYearRecordsQuery, `Records with 1906 year were truncated.`);

const cleanSports = db.run(queries.cleanSportsTable, `'Sports' table was truncated.`);

const cleanEvents = db.run(`delete from events`, `'Events' table was truncated.`);

const cleanTeams = db.run(`delete from teams`, `'Teams' table was truncated.`);

const cleanAthletes = db.run(`delete from athletes`, `'Athletes' table was truncated.`);

const cleanGames = db.run(`delete from games`, `'Games' table was truncated.`);

const cleanResults = db.run(`delete from results`, `'Results' table was truncated.`);

const fillSportsTable = db.run(queries.fillSportsQuery, `'Sports' table has been fulfilled.`);

const fillEventsTable = db.run(queries.fillEventsQuery, `'Events' table has been fulfilled.`);

const fillTeamsTable = db.run(queries.fillTeamsQuery, `'Teams' table has been fulfilled.`);

const fillGamesTable = db.run(queries.fillGamesQuery, `'Games' table has been fulfilled.`);

const resolveMultiCityProblem = db.run(queries.multiCityProblemQuery, `Multi city problem has been resolved.`);

const removeDuplicatesGames = db.run(queries.removeDuplicatesQuery, `Duplicate games has been removed.`);

const fillResulsTable = db.run(queries.fillResulsQuery, `'Results' table has been fullfilled.`);

const fillAthletesTable = db.run(queries.fillAthletesQuery, `'Athletes' table has been fulfilled.`);

const removeTemp = db.run(`drop table temp`, `'Temp' table was removed.`);

const trimAthleteNames = db.run(queries.trimAthleteNamesQuery, `Athlete names were trimmed.`);

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
  .then(trimAthleteNames)
  .then(() => {
    db.close(null, () => {
      console.log('Data was imported to DB.');
    });
  })
  .catch((err) => {
    db.close(err, () => {
      removeTemp().then(() => {
        console.log('Data importing was interrupted by error.');
      });
    });
  });
