from flask import Blueprint, request, jsonify
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
                                              user = "root",
                                              database = "website",
                                              password = serect.MySQLPassword(),
                                              charset="utf8"
                                              )

api_attraction = Blueprint("api_attraction", __name__)

@api_attraction.route("/attractions", methods=["GET"])
def attractions():
    try:
        page = request.args.get("page",0)
        page = int(page)
        keyword = request.args.get("keyword")
        start = page * 12
        amount = 12
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        trip_list = []
        if page < 0:
            return jsonify({"error":True, "message":"請輸入page頁碼 & page頁碼最小為0"}),400
        elif keyword == None:
            select = ("SELECT * FROM attraction LIMIT %s, %s")
            value = [start, amount]
            cursor.execute(select, value)
            results = cursor.fetchall()
            if results:
                for result in results:
                    columns = [col[0] for col in cursor.description]
                    data = dict(zip(columns, result))
                    data["images"] = json.loads(data["images"])
                    trip_list.append(data)
                if len(trip_list) == 12:
                    return jsonify({"nextpage":(page+1),"data":trip_list})
                elif len(trip_list) < 12:
                    return jsonify({"nextpage":None,"data":trip_list})
            else:
                return jsonify({"nextpage":None,"data":None})
        else:
            select = ('''SELECT * FROM attraction 
                    WHERE name REGEXP %s 
                    or category REGEXP %s
                    or address REGEXP %s
                    or mrt REGEXP %s
                    or direction REGEXP %s
                    or description REGEXP %s
                    LIMIT %s, %s''')
            value = [keyword, keyword, keyword, keyword, keyword, keyword, start, amount]
            cursor.execute(select, value)
            results = cursor.fetchall()
            if results:
                for result in results:
                    columns = [col[0] for col in cursor.description]
                    data = dict(zip(columns, result))
                    data["images"] = json.loads(data["images"])
                    trip_list.append(data)
                if len(trip_list) < 12:
                    return jsonify({"nextpage":None,"data":trip_list})
            return jsonify({"nextpage":(page+1),"data":trip_list})
            
    except Exception as e:
        print(f"{e}:查詢失敗")
        return jsonify({"error":True, "message":"伺服器錯誤"}),500
    finally:
        cursor.close()
        connection_object.close()
 
@api_attraction.route("/attraction/<int:id>", methods=["GET"])
def attraction(id): 
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        select = ("SELECT * FROM attraction WHERE id=%s")
        id = [id]
        cursor.execute(select, id)
        site_data = cursor.fetchone()
        if site_data:
            columns = [col[0] for col in cursor.description]
            data = dict(zip(columns, site_data))
            data["images"] = json.loads(data["images"])
            return jsonify({"data":data})
        else:
            return jsonify({"error":True, "message":"景點編號不正確"}),400
    except Exception as e:
        print(f"{e}:搜尋id過程失敗")
        return jsonify({"error":True, "message":"伺服器錯誤。搜尋景點編號過程發生錯誤"}),500
    finally:
        cursor.close()
        connection_object.close()

@api_attraction.route("/categories", methods=["GET"])
def categories():
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
        return jsonify({"data":cat_list})
    except Exception as e:
        print(f"{e}:景點分類資料錯誤")
        return jsonify({"error":True, "message":"伺服器錯誤。搜尋景點分類發生錯誤"}),500
    finally:
        cursor.close()
        connection_object.close()
