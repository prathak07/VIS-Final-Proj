import os
import sqlite3
import pandas
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
import numpy as np

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'soccer'
COLLECTION_NAME = ['teams','number_of_teams']


def player_types(country,team,forRows,midRows,defRows,gkRows):
    types = ['for','mid','def','gk']
    finalDF = pandas.DataFrame(types)
    finalDF.columns = ["type"]
    count = [len(forRows.index),len(midRows.index),len(defRows.index),len(gkRows.index)]
    countDF = pandas.DataFrame(count)
    countDF.columns = ["count"]
    finalDF = pandas.concat([finalDF,countDF],axis=1)
    table_columns = ["overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
    for i in range(len(table_columns)):
        col = []
        for j in range(4):
            if(j==0):
                colDF = forRows[table_columns[i]]
            elif(j==1):
                colDF = midRows[table_columns[i]]
            elif(j==2):
                colDF = defRows[table_columns[i]]
            else:
                colDF = gkRows[table_columns[i]]
            colDF = np.array(colDF,dtype=np.float)
            mean_value = np.nanmean(colDF)
            col.append(mean_value)
        df = pandas.DataFrame(col)
        df.columns = [table_columns[i]]
        finalDF = pandas.concat([finalDF,df],axis=1)
    #print finalDF
    print "Creating file ../data/%s/%s_players_types.csv" % (country,team)
    finalDF = finalDF.round(2)
    finalDF.to_csv('../data/'+country+'/'+team+'_players_types.csv',sep=',',index=False)
    return finalDF


def get_position(x):
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select overall_rating from player_attributes where player_api_id = '%d' and date like '" % (x)
    query = query + "2015%'"
    all_rating = cur.execute(query).fetchall()
    all_rating = np.array(all_rating,dtype=np.float)[:,0]
    rating = np.nanmean(all_rating)
    if (rating>1):
        all_football_nums = reversed(range(1,12))
        for num in all_football_nums:
            all_y_coord = cur.execute("select home_player_Y%d from Match where home_player_%d = '%d' and season = '2015/2016'" % (num,num,x)).fetchall()
            if len(all_y_coord) > 0:
                Y = np.array(all_y_coord,dtype=np.float)
                mean_y = np.nanmean(Y)
                if (mean_y >= 10.0):
                    return "for"
                elif (mean_y > 5):
                    return "mid"
                elif (mean_y > 1):
                    return "def"
                elif (mean_y == 1.0):
                    return "gk"
    sqlite_db.close()
    return None



def teamPlayers(country,team,players):
    if(not os.path.isdir('../data/'+country)):
        print "Making directory for country %s" %(country)
        os.makedirs('../data/'+country)
    print "Start fetching player details for %s" % (team)
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select pa.player_api_id,p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + players + ") and date like '2015%' group by pa.player_api_id"
    cur.execute(query)
    rows = cur.fetchall()
    sqlite_db.close()
    rowsDF = pandas.DataFrame(rows)
    rowsDF.columns = ["id","name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
    rowsDF['position'] = np.vectorize(get_position)(rowsDF['id'])
    rowsDF = rowsDF.fillna(rowsDF.mean())
    print "Creating file ../data/%s/%s_players.csv" % (country,team)
    rowsDF = rowsDF.drop('id',1)
    rowsDF = rowsDF.round(2)
    rowsDF.to_csv('../data/'+country+'/'+team+'_players.csv',sep=',',index=False)
    forRows = rowsDF.loc[rowsDF['position']=='for']
    print "Creating file ../data/%s/%s_players_for.csv" % (country,team)
    forRows.to_csv('../data/'+country+'/'+team+'_players_for.csv',sep=',',index=False)
    midRows = rowsDF.loc[rowsDF['position']=='mid']
    print "Creating file ../data/%s/%s_players_mid.csv" % (country,team)
    midRows.to_csv('../data/'+country+'/'+team+'_players_mid.csv',sep=',',index=False)
    defRows = rowsDF.loc[rowsDF['position']=='def']
    print "Creating file ../data/%s/%s_players_def.csv" % (country,team)
    defRows.to_csv('../data/'+country+'/'+team+'_players_def.csv',sep=',',index=False)
    gkRows  = rowsDF.loc[rowsDF['position']=='gk']
    print "Creating file ../data/%s/%s_players_gk.csv" % (country,team)
    gkRows.to_csv('../data/'+country+'/'+team+'_players_gk.csv',sep=',',index=False)
    player_types(country,team,forRows,midRows,defRows,gkRows)
    ratings = rowsDF['overall_rating']
    ratings = np.array(ratings,dtype=np.float)
    mean_ratings = np.nanmean(ratings)
    return mean_ratings



def getPlayers(country,team):
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select distinct c.name,l.name,t.team_long_name,m.home_player_1,m.home_player_2,m.home_player_3,m.home_player_4,m.home_player_5,m.home_player_6,m.home_player_7,m.home_player_8,m.home_player_9,m.home_player_10,m.home_player_11 from country as c join league as l on c.id = l.country_id join match as m on c.id = m.country_id join team as t on m.home_team_api_id = t.team_api_id where m.season = '2015/2016' and c.name = '"
    query = query +str(country)
    query = query + "' and t.team_long_name = '"
    query = query + str(team) + "'"
    cur.execute(query)
    rows = cur.fetchall()
    sqlite_db.close()
    rowsDF = pandas.DataFrame(rows)
    rowsDF.columns = ['country','league','team','Player1','Player2','Player3','Player4','Player5','Player6','Player7','Player8','Player9','Player10','Player11']
    rowsDF = rowsDF.fillna(0)
    res = []
    for i in range(11):
        players = rowsDF['Player'+str(i+1)]
        players = set(players)
        for player in players:
            res.append(player)
    res = set(res)
    count = len(res)
    res = list(res)
    players = ''
    for i in range(count):
        if(i==count-1):
            players = players + str(res[i])
            continue
        players = players + str(res[i]) + ','
    mean_ratings = teamPlayers(country,team,players)
    return players,count,mean_ratings



def listPlayers(countries,teams):
    players = []
    counts = []
    means = []
    for i in range(len(countries)):
        p,c,m = getPlayers(countries[i],teams[i])
        players.append(p)
        counts.append(c)
        means.append(m)
    return players,counts,means



def team(country):
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select distinct c.name,l.name,t.team_long_name from country as c join league as l on c.id = l.country_id join match as m on c.id = m.country_id join team as t on m.home_team_api_id = t.team_api_id where m.season = '2015/2016' and c.name = '"
    query = query + str(country) + "'"
    cur.execute(query)
    rows = cur.fetchall()
    sqlite_db.close()
    rowsDF = pandas.DataFrame(rows)
    rowsDF.columns = ['country','league','team']
    countries = rowsDF['country']
    teams = rowsDF['team']
    players,counts,means = listPlayers(countries,teams)
    rowsDF['count'] = counts
    rowsDF['player_ids'] = players
    rowsDF['ratings'] = means
    # print rowsDF
    rowsDF = rowsDF.round(2)
    rowsDF.to_csv('../data/'+country+'.csv',sep=',',index=False)
    ratings = rowsDF['ratings']
    ratings = np.array(ratings,dtype=np.float)
    mean_ratings = np.nanmean(ratings)
    return mean_ratings



def number_of_teams():
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    cur.execute("select country,league,count(country) from (select distinct c.name as country,l.name as league,t.team_long_name as team from country as c join league as l on c.id = l.country_id join match as m on c.id = m.country_id join team as t on m.home_team_api_id = t.team_api_id where m.season = '2015/2016') group by country")
    rows = cur.fetchall()
    sqlite_db.close()
    rowsDF = pandas.DataFrame(rows)
    rowsDF.columns = ['country','league','number_of_teams']
    countries = rowsDF['country']
    ratings = []
    for i in range(len(countries)):
        ratings.append(team(countries[i]))
    rowsDF['ratings'] = ratings
    rowsDF = rowsDF.round(2)
    rowsDF.to_csv('../data/number_of_teams.csv',sep=',',index=False)



if __name__ == '__main__':
    number_of_teams()

# print rowsDF
#rowsDF.to_csv('./data/england.csv',sep=',',index=False)