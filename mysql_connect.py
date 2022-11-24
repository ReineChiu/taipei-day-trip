import sys
sys.path.append("modules")
import serect
from mysql.connector import Error
from mysql.connector import pooling
import mysql.connector
import json

connection_pool = pooling.MySQLConnectionPool(pool_name = "pynative_pool",
                                              pool_size = 5,
                                              host = "localhost",
                                              database = "website",
                                              user = "root",
                                              password = serect.MySQLPassword(),
                                              charset = "utf8")

def get_attractions(page,keyword):
    try:
        start = page * 12
        amount = 13
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        
        trip_list = []
        if keyword:
            select = ('''SELECT * FROM attraction WHERE 
                        name REGEXP %s 
                        or category REGEXP %s
                        LIMIT %s, %s''')
            value = [keyword, keyword, start, amount]
            cursor.execute(select, value)
            results = cursor.fetchall() 
            for result in results:
                columns = [col[0] for col in cursor.description]
                data = dict(zip(columns, result))
                data["images"] = json.loads(data["images"]) 
                trip_list.append(data)
            return trip_list
        else:
            select = ("SELECT * FROM attraction LIMIT %s, %s")
            value = [start, amount]
            cursor.execute(select, value)
            results = cursor.fetchall()
            for result in results:
                columns = [col[0] for col in cursor.description]
                data = dict(zip(columns, result))
                data["images"] = json.loads(data["images"]) 
                trip_list.append(data)
            return trip_list          
    except Exception as e:
        print(f"{e}:輸入資料錯誤")
        return None
    finally:
        cursor.close()
        connection_object.close()

def attraction_id(attractionId):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        select = ("SELECT * FROM attraction WHERE id=%s")
        id = [attractionId]
        cursor.execute(select, id)
        result = cursor.fetchone()
        if result:
            columns = [col[0] for col in cursor.description]
            data = dict(zip(columns, result))
            data["images"] = json.loads(data["images"])
            return data
        else:
            return None
    except Exception as e:
        print(f"{e}:搜尋id過程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()

def category_list():
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        select =("SELECT DISTINCT category FROM attraction")
        cursor.execute(select)
        results = cursor.fetchall() 
        cat_list = []
        for result in results:
            for cat in result:
                cat_list.append(cat)
        return cat_list
    except Exception as e:
        print(f"{e}:搜尋景點分類失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()