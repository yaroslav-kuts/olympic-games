const data = require('./libs/data');
const chart = require('./libs/chart');
const queries = require('./libs/queries');

const show = async function (args) {
  const getTeamsPromise = data.all(`select id, noc_name from teams`);
  const teams = await getTeamsPromise();
  const seasons = { 'winter': 1, 'summer': 0 };
  const medals = { 'gold': 1, 'silver': 2, 'bronze': 3 };

  let noc, season, medal, year;

  args.forEach(arg => {
    if (seasons.hasOwnProperty(arg.toLowerCase())) {
      season = seasons[arg.toLowerCase()];
    }
    else if (medals.hasOwnProperty(arg.toLowerCase())) {
      medal = medals[arg.toLowerCase()] || 0;
    }
    else if (/^(18|19|20)[0-9]{2}$/.test(arg)) {
      year = arg;
    }
    else if (teams.some(noc => noc.noc_name === arg.toUpperCase())) {
      noc = arg.toUpperCase();
    }
    else throw new Error(`Unrecognisable param: ${arg}`);
  });

  if (season === undefined) throw new Error('You have to specify season param!');

  if (noc) {
    const getAmountPromise = data.all(queries.getAmountOfMedalsQuery(season, noc, medal));
    let rows = await getAmountPromise();
    rows = rows.map(row => [row.Year, row.Amount || 0]);
    chart.draw(rows, 'medals', ['Year', 'Amount']);
  }
  else {
    const getTopPromise = data.all(queries.getTopTeamsQuery(season, year, medal));
    let rows = await getTopPromise();
    rows = rows.map(row => [row.NOC, row.Amount || 0]);
    chart.draw(rows, 'top-teams', ['NOC', 'Amount']);
  }
};

var main = function () {
  show(process.argv.slice(2))
  .then(() => { data.close(); })
  .catch((err) => { data.close(err); });
}

main();
