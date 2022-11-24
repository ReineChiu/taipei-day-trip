from flask import Blueprint, request, jsonify
from mysql_connect import get_attractions, attraction_id, category_list

import json

api_attraction = Blueprint("api_attraction", __name__)

@api_attraction.route("/attractions", methods=["GET"])
def attractions():
    try:
        page = request.args.get("page")
        page = int(page)
        keyword = request.args.get("keyword")
        if page < 0:
            return jsonify({"error":True, "message":"請輸入page頁碼 & page頁碼最小為0"}) 
        get_att = get_attractions(page=page,keyword=keyword)
        if get_att: 
            if len(get_att) <= 12:
               return jsonify({"nextpage":None,"data":get_att[0:12]})
            return jsonify({"nextpage":(page+1),"data":get_att[0:12]})
    except Exception as e:
        print(f"{e}:查詢失敗")
        return jsonify({"error":True, "message":"伺服器發生錯誤"})

@api_attraction.route("/attraction/<int:id>", methods=["GET"])
def attraction(id):
    try:
        serachId = attraction_id(id)
        if serachId == None:
            return jsonify({"error":True, "message":"景點編號輸入錯誤"})
        else:
            return jsonify({"data":serachId})
    except Exception as e:
        print(f"{e}:搜尋id過程失敗")
        return jsonify({"error":True, "message":"搜尋景點編號過程發生錯誤"})

@api_attraction.route("/categories", methods=["GET"])
def categories():
    try:
        data = category_list()
        return jsonify({"data":data})
    except Exception as e:
        print(f"{e}:搜尋景點分類失敗")
        return jsonify({"error":True, "message":"搜尋景點分類,發生錯誤"})