select distinct c.name,l.name,t.team_long_name,ta.buildUpPlaySpeed,ta.buildUpPlayDribbling,ta.buildUpPlayPassing,ta.chanceCreationPassing,ta.chanceCreationCrossing,ta.chanceCreationShooting,ta.defencePressure,ta.defenceAggression,ta.defenceTeamWidth
    from country as c
        join league as l
            on c.id = l.country_id
        join match as m
            on c.id = m.country_id
        join team as t
            on m.home_team_api_id = t.team_api_id
        join team_attributes as ta
            on t.team_api_id = ta.team_api_id
where m.season = '2015/2016' and ta.date like '%2015%';


select distinct c.name,l.name,t.team_long_name,m.home_player_1,m.home_player_2,m.home_player_3,m.home_player_4,m.home_player_5,m.home_player_6,m.home_player_7,m.home_player_8,m.home_player_9,m.home_player_10,m.home_player_11
    from country as c
        join league as l
            on c.id = l.country_id
        join match as m
            on c.id = m.country_id
        join team as t
            on m.home_team_api_id = t.team_api_id
where m.season = '2015/2016';


select distinct c.name,l.name,t.team_long_name
    from country as c
        join league as l
            on c.id = l.country_id
        join match as m
            on c.id = m.country_id
        join team as t
            on m.home_team_api_id = t.team_api_id
where m.season = '2015/2016';

// ta.buildUpPlaySpeed,ta.buildUpPlayDribbling,ta.buildUpPlayPassing,ta.chanceCreationPassing,ta.chanceCreationCrossing,ta.chanceCreationShooting,ta.defencePressure,ta.defenceAggression,ta.defenceTeamWidth


select distinct c.name,l.name,t.team_long_name from country as c join league as l on c.id = l.country_id join match as m on c.id = m.country_id join team as t on m.home_team_api_id = t.team_api_id where m.season = '2015/2016'

select country,league,count(country) from (select distinct c.name as country,l.name as league,t.team_long_name as team from country as c join league as l on c.id = l.country_id join match as m on c.id = m.country_id join team as t on m.home_team_api_id = t.team_api_id where m.season = '2015/2016') group by country

select pa.player_api_id,p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in (???) and date like '2015%' group by pa.player_api_id