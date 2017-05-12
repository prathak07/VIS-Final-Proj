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
from sklearn.decomposition import PCA

for_attr = []
mid_attr = []
def_attr = []
gk_attr = []

###############################################################################################################################################

def playerInfo(player_id):
    print "Start fetching information about %s" % (player_id)
    
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2016%' group by pa.player_api_id"
    cur.execute(query)
    rows16 = cur.fetchall()
    sqlite_db.close()
    if rows16:
        rows16DF = pandas.DataFrame(rows16)
        rows16DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows16DF['year'] = "2016"

    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2015%' group by pa.player_api_id"
    cur.execute(query)
    rows15 = cur.fetchall()
    sqlite_db.close()
    if rows15:
        rows15DF = pandas.DataFrame(rows15)
        rows15DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows15DF['year'] = "2015"

    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2014%' group by pa.player_api_id"
    cur.execute(query)
    rows14 = cur.fetchall()
    sqlite_db.close()
    if rows14:
        rows14DF = pandas.DataFrame(rows14)
        rows14DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows14DF['year'] = "2014"

    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2013%' group by pa.player_api_id"
    cur.execute(query)
    rows13 = cur.fetchall()
    sqlite_db.close()
    if rows13:
        rows13DF = pandas.DataFrame(rows13)
        rows13DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows13DF['year'] = "2013"

    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2012%' group by pa.player_api_id"
    cur.execute(query)
    rows12 = cur.fetchall()
    sqlite_db.close()
    if rows12:
        rows12DF = pandas.DataFrame(rows12)
        rows12DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows12DF['year'] = "2012"
    
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2011%' group by pa.player_api_id"
    cur.execute(query)
    rows11 = cur.fetchall()
    sqlite_db.close()
    if rows11:
        rows11DF = pandas.DataFrame(rows11)
        rows11DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows11DF['year'] = "2011"

    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2010%' group by pa.player_api_id"
    cur.execute(query)
    rows10 = cur.fetchall()
    sqlite_db.close()
    if rows10:
        rows10DF = pandas.DataFrame(rows10)
        rows10DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows10DF['year'] = "2010"
    
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2009%' group by pa.player_api_id"
    cur.execute(query)
    rows09 = cur.fetchall()
    sqlite_db.close()
    if rows09:
        rows09DF = pandas.DataFrame(rows09)
        rows09DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows09DF['year'] = "2009"
    
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2008%' group by pa.player_api_id"
    cur.execute(query)
    rows08 = cur.fetchall()
    sqlite_db.close()
    if rows08:
        rows08DF = pandas.DataFrame(rows08)
        rows08DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows08DF['year'] = "2008"
    
    sqlite_db = sqlite3.connect('../data/database.sqlite')
    sqlite_db.row_factory = sqlite3.Row
    sqlite_db.text_factory = str
    cur = sqlite_db.cursor()
    query = "select p.player_name,avg(overall_rating),avg(crossing),avg(finishing),avg(heading_accuracy),avg(short_passing),avg(volleys),avg(dribbling),avg(curve),avg(free_kick_accuracy),avg(long_passing),avg(ball_control),avg(acceleration),avg(sprint_speed),avg(agility),avg(reactions),avg(balance),avg(shot_power),avg(jumping),avg(stamina),avg(strength),avg(long_shots),avg(aggression),avg(interceptions),avg(positioning),avg(vision),avg(penalties),avg(marking),avg(standing_tackle),avg(sliding_tackle),avg(gk_diving),avg(gk_handling),avg(gk_kicking),avg(gk_positioning),avg(gk_reflexes) from player_attributes as pa join player as p on pa.player_api_id = p.player_api_id where pa.player_api_id in ("
    query = query + player_id + ") and date like '2007%' group by pa.player_api_id"
    cur.execute(query)
    rows07 = cur.fetchall()
    sqlite_db.close()
    if rows07:
        rows07DF = pandas.DataFrame(rows07)
        rows07DF.columns = ["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"]
        rows07DF['year'] = "2007"
    
    rowsFinal = pandas.DataFrame(columns=["name","overall_rating","crossing","finishing","heading_accuracy","short_passing","volleys","dribbling","curve","free_kick_accuracy","long_passing","ball_control","acceleration","sprint_speed","agility","reactions","balance","shot_power","jumping","stamina","strength","long_shots","aggression","interceptions","positioning","vision","penalties","marking","standing_tackle","sliding_tackle","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes","year"])

    if rows07:
        rowsFinal = pandas.concat([rowsFinal,rows07DF],axis=0)
    if rows08:
        rowsFinal = pandas.concat([rowsFinal,rows08DF],axis=0)
    if rows09:
        rowsFinal = pandas.concat([rowsFinal,rows09DF],axis=0)
    if rows10:
        rowsFinal = pandas.concat([rowsFinal,rows10DF],axis=0)
    if rows11:
        rowsFinal = pandas.concat([rowsFinal,rows11DF],axis=0)
    if rows12:
        rowsFinal = pandas.concat([rowsFinal,rows12DF],axis=0)
    if rows13:
        rowsFinal = pandas.concat([rowsFinal,rows13DF],axis=0)
    if rows14:
        rowsFinal = pandas.concat([rowsFinal,rows14DF],axis=0)
    if rows15:
        rowsFinal = pandas.concat([rowsFinal,rows15DF],axis=0)
    if rows16:
        rowsFinal = pandas.concat([rowsFinal,rows16DF],axis=0)

    player_name = rowsFinal["name"]
    player_name = set(player_name)
    player_name = list(player_name)
    player_name = "".join(player_name)

    rowsFinal = rowsFinal.drop('name',1)
    rowsFinal = rowsFinal.fillna(rowsFinal.mean())
    rowsFinal = rowsFinal.round(2)
    rowsFinal.to_csv('../data/players/'+player_name+'.csv',sep=',',index=False)
    print "Created file for %s" % (player_name)



###############################################################################################################################################

def playersData(team,player_ids):
    if(not os.path.isdir('../data/players')):
        print "Making directory for players"
        os.makedirs('../data/players')
    player_ids = player_ids.split(',')
    for player_id in player_ids:
        playerInfo(player_id)
    print "Got all the info about all players in %s team" % (team)

###############################################################################################################################################

def data_pca(df,country,team,pos):
    directory = '../data/'+country+'/'+team+'_players_'+pos+'_'
    df_name = df['name'].values
    # print df_name
    df = df.drop('name',1)
    df = df.drop('overall_rating',1)
    df = df.drop('position',1)
    # print "Starting PCA:"
    pca = PCA()
    col_names = df.columns.values
    pca.fit_transform(df)
    eigen_values = pca.explained_variance_
    top = pca.components_
    # file_name = directory+'pca_components.csv'
    # print "Creating file "+file_name
    # topDF = pandas.DataFrame(top)
    # topDF.to_csv(file_name,sep=',',index=False)
    eigen_tuple_list = []
    for i in range(len(eigen_values)):
        eigen_tuple_list.append((i+1,eigen_values[i]))
    # file_name = directory+'pca_eigens.csv'
    # print "Creating file "+file_name
    # tupDF = pandas.DataFrame(eigen_tuple_list)
    # tupDF.columns = ['variable','col1']
    # tupDF.to_csv(file_name,sep=',',index=False)
    # By observing the Eigen value plot no_of_components is found to be 8
    # print "Intrinsic Dimensionality: "+str(len(top))
    sq_sum = {}
    for i in range(len(top[0])):
        sum = 0
        for j in range(len(top)):
            sum += top[j][i]**2
        s = col_names[i]
        sq_sum[s] = sum
    tup_list = []
    for i in range(len(col_names)):
        tup_list.append((col_names[i],sq_sum[col_names[i]]))
    tup_list = sorted(tup_list, key=lambda x:-1*x[1])
    print "Top 3 PCA Loadings: "+tup_list[0][0]+", "+tup_list[1][0]+' and '+tup_list[2][0]
    top3_col_list = []
    for i in range(3):
        top3_col_list.append(tup_list[i][0])
    file_name = directory+'scree_loadings.csv'
    print "Creating file "+file_name
    tupDF = pandas.DataFrame(tup_list)
    tupDF.columns = ['variable','col1']
    tupDF.to_csv(file_name,sep=',',index=False)
    # print "PCA 3 started"
    # pca = PCA(n_components=3)
    # sample = pandas.DataFrame(pca.fit_transform(df))
    # sample.columns = ['PC1','PC2','PC3']
    # print "PCA 3 finished"
    # file_name = directory + 'pca3.csv'
    # print "Creating file "+file_name
    # sample.to_csv(file_name,sep=',',index=False)
    random_tuple = []
    for i in range(len(df)):
        random_tuple.append((df[top3_col_list[0]].iloc[i],df[top3_col_list[1]].iloc[i],df[top3_col_list[2]].iloc[i]))
    random_tuple_df = pandas.DataFrame(random_tuple)
    random_tuple_df.columns = [top3_col_list[0],top3_col_list[1],top3_col_list[2]]
    random_tuple_df['name'] = df_name
    file_name = directory + 'pca3_loadings.csv'
    print "Creating file "+file_name
    random_tuple_df.to_csv(file_name,sep=',',index=False)
    col_list = " ".join(top3_col_list)
    return col_list

###############################################################################################################################################

def player_types(country,team,forRows,midRows,defRows,gkRows,forAttr,midAttr,defAttr,gkAttr):
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
    attributes = []
    attributes.append(forAttr)
    attributes.append(midAttr)
    attributes.append(defAttr)
    attributes.append(gkAttr)
    finalDF['attributes'] = attributes
    finalDF.to_csv('../data/'+country+'/'+team+'_players_types.csv',sep=',',index=False)
    return finalDF

###############################################################################################################################################

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

###############################################################################################################################################

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
    forAttr = data_pca(forRows,country,team,'for')
    
    midRows = rowsDF.loc[rowsDF['position']=='mid']
    midAttr = data_pca(midRows,country,team,'mid')
    
    defRows = rowsDF.loc[rowsDF['position']=='def']
    defAttr = data_pca(defRows,country,team,'def')
    
    gkRows  = rowsDF.loc[rowsDF['position']=='gk']
    gkAttr = data_pca(gkRows,country,team,'gk')
    
    player_types(country,team,forRows,midRows,defRows,gkRows,forAttr,midAttr,defAttr,gkAttr)
    
    forRows = forRows.drop(["gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"],1)
    print "Creating file ../data/%s/%s_players_for.csv" % (country,team)
    forRows.to_csv('../data/'+country+'/'+team+'_players_for.csv',sep=',',index=False)

    midRows = midRows.drop(["dribbling","ball_control","reactions","gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"],1)
    print "Creating file ../data/%s/%s_players_mid.csv" % (country,team)
    midRows.to_csv('../data/'+country+'/'+team+'_players_mid.csv',sep=',',index=False)

    defRows = defRows.drop(["gk_diving","gk_handling","gk_kicking","gk_positioning","gk_reflexes"],1)
    print "Creating file ../data/%s/%s_players_def.csv" % (country,team)
    defRows.to_csv('../data/'+country+'/'+team+'_players_def.csv',sep=',',index=False)

    gkRows = gkRows.drop(["volleys","dribbling","curve","ball_control","long_shots","interceptions","positioning","standing_tackle","sliding_tackle"],1)
    print "Creating file ../data/%s/%s_players_gk.csv" % (country,team)
    gkRows.to_csv('../data/'+country+'/'+team+'_players_gk.csv',sep=',',index=False)

    global for_attr
    global mid_attr
    global def_attr
    global gk_attr

    forAttr = forAttr.split(" ");
    for i in range(len(forAttr)):
        for_attr.append(forAttr[i])

    midAttr = midAttr.split(" ");
    for i in range(len(midAttr)):
        mid_attr.append(midAttr[i])
    
    defAttr = defAttr.split(" ");
    for i in range(len(defAttr)):
        def_attr.append(defAttr[i])
    
    gkAttr = gkAttr.split(" ");
    for i in range(len(gkAttr)):
        gk_attr.append(gkAttr[i])
    
    for_attr = set(for_attr)
    mid_attr = set(mid_attr)
    def_attr = set(def_attr)
    gk_attr = set(gk_attr)

    for_attr = list(for_attr)
    mid_attr = list(mid_attr)
    def_attr = list(def_attr)
    gk_attr = list(gk_attr)

    ratings = rowsDF['overall_rating']
    ratings = np.array(ratings,dtype=np.float)
    mean_ratings = np.nanmean(ratings)
    return mean_ratings

###############################################################################################################################################

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
    playersData(team,players)
    return players,count,mean_ratings

###############################################################################################################################################

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

###############################################################################################################################################

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

###############################################################################################################################################

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
    
    global for_attr
    global mid_attr
    global def_attr
    global gk_attr
    
    for_attr = set(for_attr)
    mid_attr = set(mid_attr)
    def_attr = set(def_attr)
    gk_attr = set(gk_attr)

    for_attr = list(for_attr)
    mid_attr = list(mid_attr)
    def_attr = list(def_attr)
    gk_attr = list(gk_attr)

    print "\n\nFor. Attributes: "
    print for_attr
    print "\n\nMid. Attributes: "
    print mid_attr
    print "\n\nDef. Attributes: "
    print def_attr
    print "\n\nGK. Attributes: "
    print gk_attr

###############################################################################################################################################

if __name__ == '__main__':
    number_of_teams()
