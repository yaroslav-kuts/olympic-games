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


var castSeasonToEnum = promisifyQuery(queries.seasonToEnumQuery, [], `Season column of temp table casted to enum!`);

var dropIndexes = () => {
  return new Promise((resolve, reject) => {
    db.run(queries.dropGamesIndex);
    db.run(queries.dropSportsIndex);
    db.run(queries.dropEventsIndex);
    db.run(queries.dropAthletesIndex);
    resolve();
  });
};

var createGamesIndex = promisifyQuery(queries.createGamesIndexQuery, [], `Index in games table was created!`);

// var createEventsIndex = () => {
//   return new Promise((resolve, reject) => {
//     db.run(queries.createEventsIndexQuery, [], function (err) {
//       if (err) console.error(err.message);
//       console.log(`Index in games table was created!`);
//       resolve();
//     });
//   });
// };

var createEventsIndex = promisifyQuery(queries.createEventsIndexQuery, [], `Index in games table was created!`);

// var createSportsIndex = () => {
//   return new Promise((resolve, reject) => {
//     db.run(queries.createSportsIndexQuery, [], function (err) {
//       if (err) console.error(err.message);
//       console.log(`Index in sports table was created!`);
//       resolve();
//     });
//   });
// };

var createSportsIndex = promisifyQuery(queries.createSportsIndexQuery, [], `Index in sports table was created!`);

// var createAthletesIndex = () => {
//   return new Promise((resolve, reject) => {
//     db.run(queries.createAthletesIndexQuery, [], function (err) {
//       if (err) console.error(err.message);
//       console.log(`Index in athletes table was created!`);
//       resolve();
//     });
//   });
// };

var createAthletesIndex = promisifyQuery(queries.createAthletesIndexQuery, [], `Index in athletes table was created!`);

// var removeUnofficialYearRecords = () => {
//   return new Promise((resolve, reject) => {
//     db.run(queries.removeUnofficialYearRecordsQuery, [], function (err) {
//       if (err) console.error(err.message);
//       console.log(`Records with 1906 year were truncated!`);
//       resolve();
//     });
//   });
// };

var removeUnofficialYearRecords = promisifyQuery(queries.removeUnofficialYearRecordsQuery, [], `Records with 1906 year were truncated!`);

var cleanSports = () => {
  return new Promise((resolve, reject) => {
    db.run(queries.cleanSportsTable, [], function (err) {
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
    db.run(queries.fillSportsQuery, [], function (err) {
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
    db.run(queries.fillEventsQuery, [], function (err) {
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
    db.run(queries.fillTeamsQuery, [], function (err) {
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
    db.run(queries.fillGamesQuery, [], function (err) {
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

var fillResulsTable = () => {
  return new Promise((resolve, reject) => {
    db.run(queries.fillResulsQuery, [], function (err) {
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

var fillAthletesTable = () => {
  return new Promise((resolve, reject) => {
    db.run(queries.fillAthletesQuery, [], function (err) {
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
  .then(() => { return createSportsIndex(); })
  .then(() => { return createEventsIndex(); })
  .then(() => { return createGamesIndex(); })
  .then(() => { return createAthletesIndex(); })
  .then(() => { return castSeasonToEnum(); })
  .then(() => { return fillResulsTable(); })
  .then(() => { return dropIndexes(); })
  .then(() => { return removeTemp(); })
  // .then(() => { return prettifyName(); })
  .then(() => { console.log('Data was loaded to DB!'); });

db.close();
