const seasonToEnumQuery =
  `update temp
   set season =
   case
     when season = 'Summer' then 0
     else 1
   end`;

const createGamesIndexQuery =
 `create unique index g_names ON games(year, season)`;

const createEventsIndexQuery =
 `create unique index e_names ON events(name)`;

const createSportsIndexQuery =
 `create unique index s_names ON sports(name)`;

const createAthletesIndexQuery =
 `create index a_names ON athletes(full_name)`;

const dropGamesIndex = `drop index g_names`;

const dropSportsIndex = `drop index s_names`;

const dropEventsIndex = `drop index e_names`;

const dropAthletesIndex = `drop index a_names`;

const removeUnofficialYearRecordsQuery =
  `delete from temp where year = 1906;`;

const cleanSportsTable = `delete from sports`;

const getTeamsQuery = `select noc_name team from teams`;

const getYearsQuery = `select distinct year from games`;

const fillSportsQuery =
  `insert into sports (name)
   select distinct sport from temp
   where sport is not null`;

const fillEventsQuery =
  `insert into events (name)
   select distinct event from temp
   where event is not null`;

const fillTeamsQuery =
  `insert into teams (name, noc_name)
   select team, NOC from temp
   group by NOC`;

const fillGamesQuery =
  `insert into games (year, season, city)
   select year, season, city from
     (select distinct games, year,
      case season
        when 'Summer' then 0
        when 'Winter' then 1
        else NULL
      end season,
      city from temp
      where year is not null
      and year <> 1906)`;

const fillAthletesQuery =
  `insert into athletes (full_name, age, sex, params, team_id)
   select distinct temp.name n,
   case
     when temp.sex = 'NA' then NULL
   end s,
   case
     when temp.age = 'NA' then NULL
   end a,
   case
     when temp.height <> 'NA'
       and temp.height is not NULL
       and temp.weight <> 'NA'
       and temp.weight is not NULL
     then '{ "height": "' || temp.height || '", "weight": "' || temp.weight || '" }'
     when temp.height <> 'NA'
       and temp.height is not NULL
     then '{ "height": "' || temp.height || '" }'
     when temp.weight <> 'NA'
       and temp.weight is not NULL
     then '{ "weight": "' || temp.weight || '" }'
     else '{ }'
   end h, t.id
   from temp
   join teams t on (temp.NOC = t.noc_name)
   group by temp.name`;

const fillResulsQuery =
  `insert into results
   (athlete_id, game_id, sport_id, event_id, medal)
   select
     (select id from athletes where athletes.full_name = temp.name) name,
     (select id from games
      where games.year = temp.year
      and games.season = temp.season) game,
     (select id from sports where sports.name = temp.sport) sport,
     (select id from events where events.name = temp.event) event,
     case medal
       when 'Gold' then 1
       when 'Silver' then 2
       when 'Bronze' then 3
       else 0
     end medal
   from temp`;

const multiCityProblemQuery =
  `update games
   set city = 'Melbourne, Stockholm'
   where year = 1956
   and season = 0`;

const removeDuplicatesQuery =
  `delete from games
   where id = (select id from games
               where year = 1956
               and season = 0
               limit 1)`;

const trimAthleteNamesQuery =
  `update athletes set full_name = trim(full_name)`;

const removeQuotemarksInAthleteNames =
  `update athletes set full_name = replace(full_name, '"', '')`;

const removeLeftBracketsQuery =
  `update athletes set full_name = replace(full_name, '(', '')`;

const removeRightBracketsQuery =
  `update athletes set full_name = replace(full_name, ')', '')`;

const getAmountOfMedalsQuery = function (season, noc, medal) {
  medal = medal ? `= ${medal}` : ` > 0`;
  return `select year year, res.num amount
          from games left outer join
            (select g.id, count(r.medal) num from results r
            join games g on (r.game_id = g.id)
            join athletes a on (r.athlete_id = a.id)
            join teams t on (a.team_id = t.id)
            where g.season = ${season}
            and t.noc_name = '${noc}'
            and r.medal ${medal}
            group by g.year) res
          on (games.id = res.id) order by year`;
};

const getTopTeamsQuery = function (season, year, medal) {
  year = year ? `and g.year = ${year}` : ``;
  medal = medal ? `= ${medal}` : ` > 0`;
  return `select t.noc_name team, count(r.medal) amount from results r
          join games g on (r.game_id = g.id)
          join athletes a on (r.athlete_id = a.id)
          join teams t on (a.team_id = t.id)
          where g.season = ${season}
          ${year}
          and r.medal ${medal}
          group by t.id
          having Amount >
          (select round(avg(num)) from
            (select count(r.medal) num from results r
             join games g on (r.game_id = g.id)
             join athletes a on (r.athlete_id = a.id)
             join teams t on (a.team_id = t.id)
             where g.season = ${season}
             ${year}
             and r.medal ${medal}
             group by t.id))
          order by Amount desc`;
};

module.exports = {
  seasonToEnumQuery,
  createGamesIndexQuery,
  createEventsIndexQuery,
  createSportsIndexQuery,
  createAthletesIndexQuery,
  dropGamesIndex,
  dropSportsIndex,
  dropEventsIndex,
  dropAthletesIndex,
  removeUnofficialYearRecordsQuery,
  cleanSportsTable,
  getTeamsQuery,
  getYearsQuery,
  fillSportsQuery,
  fillEventsQuery,
  fillTeamsQuery,
  fillGamesQuery,
  fillAthletesQuery,
  fillResulsQuery,
  multiCityProblemQuery,
  removeDuplicatesQuery,
  trimAthleteNamesQuery,
  removeQuotemarksInAthleteNames,
  removeLeftBracketsQuery,
  removeRightBracketsQuery,
  getAmountOfMedalsQuery,
  getTopTeamsQuery
};
