module.exports = {

  seasonToEnumQuery: `update temp
                      set season =
                      case
                        when season = 'Summer' then 0
                        else 1
                      end`,

  createGamesIndexQuery: `create unique index g_names ON games(year, season)`,

  createEventsIndexQuery: `create unique index e_names ON events(name)`,

  createSportsIndexQuery: `create unique index s_names ON sports(name)`,

  createAthletesIndexQuery: `create index a_names ON athletes(full_name)`,

  dropGamesIndex: `drop index g_names`,

  dropSportsIndex: `drop index s_names`,

  dropEventsIndex: `drop index e_names`,

  dropAthletesIndex: `drop index a_names`,

  removeUnofficialYearRecordsQuery: `delete from temp where year = 1906;`,

  cleanSportsTable: `delete from sports`,

  fillSportsQuery: `insert into sports (name)
                    select distinct sport from temp
                    where sport is not null`,

  fillEventsQuery: `insert into events (name)
                    select distinct event from temp
                    where event is not null`,

  fillTeamsQuery: `insert into teams (name, noc_name)
                   select team, NOC from temp
                   group by NOC`,

  fillGamesQuery: `insert into games (year, season, city)
                   select year, season, city from
                     (select distinct games, year,
                      case season
                        when 'Summer' then 0
                        when 'Winter' then 1
                        else NULL
                      end season,
                      city from temp
                      where year is not null
                      and year <> 1906)`,

  fillAthletesQuery: `insert into athletes (full_name, age, sex, params, team_id)
                      select distinct temp.name n, temp.sex s, temp.age a,
                      case
                        when temp.height <> 'NA' and temp.height is not NULL and temp.weight <> 'NA' and temp.weight is not NULL then '{ "height": "' || temp.height || '", "weight": "' || temp.weight || '" }'
                        when temp.height <> 'NA' and temp.height is not NULL then '{ "height": "' || temp.height || '" }'
                        when temp.weight <> 'NA' and temp.weight is not NULL then '{ "weight": "' || temp.weight || '" }'
                        else '{ }'
                      end h, t.id
                      from temp
                      join teams t on (temp.NOC = t.noc_name)
                      group by temp.name`,

  fillResulsQuery: `insert into results
                    (athlete_id, game_id, sport_id, event_id, medal)
                    select
                      (select id from athletes where athletes.full_name = temp.name) name,
                      (select id from games where games.year = temp.year and games.season = temp.season) game,
                      (select id from sports where sports.name = temp.sport) sport,
                      (select id from events where events.name = temp.event) event,
                      case medal
                        when 'Gold' then 1
                        when 'Silver' then 2
                        when 'Bronze' then 3
                        else 0
                      end medal
                    from temp`,

  getNamesToAdjust: `select id, full_name from athletes
                     where full_name like '%(%)%'
                     or full_name like '%"%"%'`,

  multiCityProblemQuery: `update games
                          set city = 'Melbourne, Stockholm'
                          where year = 1956
                          and season = 0`,

  removeDuplicatesQuery: `delete from games
                          where id = (select id from games
                                      where year = 1956
                                      and season = 0
                                      limit 1)`
};
