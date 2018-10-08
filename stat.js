const db = require('./libs/db');
const chart = require('./libs/chart');
const queries = require('./libs/queries');

const show = async function (args) {
  const getTeamsPromise = db.all(queries.getTeamsQuery);
  const getYearsPromise = db.all(queries.getYearsQuery);

  const teams = await getTeamsPromise();
  const years = await getYearsPromise();
  const medals = { 'gold': 1, 'silver': 2, 'bronze': 3 };
  const seasons = { 'winter': 1, 'summer': 0 };

  let team, season, medal, year;

  args.forEach(arg => {
    if (seasons.hasOwnProperty(arg.toLowerCase()))
      season = seasons[arg.toLowerCase()];
    else if (medals.hasOwnProperty(arg.toLowerCase()))
      medal = medals[arg.toLowerCase()] || 0;
    else if (years.some(row => row.year === parseInt(arg)))
      year = arg;
    else if (teams.some(row => row.team === arg.toUpperCase()))
      team = arg.toUpperCase();
    else throw new Error(`Unrecognisable or incorrect param: ${arg}`);
  });

  if (season === undefined) throw new Error('You have to specify season param!');

  if (team) {
    const getAmountPromise = db.all(queries.getAmountOfMedalsQuery(season, team, medal));
    let rows = await getAmountPromise();
    rows = rows.map(row => [row.Year, row.Amount || 0]);
    chart.draw(rows, 'medals', ['Year', 'Amount']);
  }
  else {
    const getTopPromise = db.all(queries.getTopTeamsQuery(season, year, medal));
    let rows = await getTopPromise();
    rows = rows.map(row => [row.NOC, row.Amount || 0]);
    chart.draw(rows, 'top-teams', ['NOC', 'Amount']);
  }
};

var main = function () {
  show(process.argv.slice(2))
  .then(() => { db.close(); })
  .catch((err) => { db.close(err); });
};

main();
