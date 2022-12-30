from flask import Blueprint, request, jsonify
import os, json, jwt
from mysql_connect import select_booking, insert_booking, delete_booking, check_booking


api_booking = Blueprint("api_booking", __name__)

@api_booking.route("/booking", methods=["GET"])
def get_booking():
    try:
        token = request.cookies.get("token")
        if token:
            data = jwt.decode(token, os.getenv("JWT_SERECT_KEY"), algorithms="HS256")
            user_id = data["id"]
            username = data["username"]
            email = data["email"]
            booking_data = select_booking(user_id=user_id)
            if booking_data:  
                return ({"data":booking_data[:]},200)
            else:
                data = None
                return ({"data":data},200)
        else:
            data = None
            return ({"data":data},200)

    except Exception as e:
        print(f"{e}:確認發生錯誤")
        return ({"error":True, "message":"確認資訊過程發生錯誤"},500)

@api_booking.route("/booking", methods=["POST"])
def creat_booking():
    try:
        token = request.cookies.get("token")
        if token:
            data = jwt.decode(token, os.getenv("JWT_SERECT_KEY"), algorithms="HS256")
            user_id = data["id"]
            date = request.json.get("date")
            time = request.json.get("time")

            price = request.json.get("price")
            attraction_id = request.json.get("attractionId")

            if not (user_id and date and time and price and attraction_id):
                return ({"error":True, "message":"建立失敗，輸入不正確或其他原因"},400)

            else:
                insert_booking(attraction_id = attraction_id, user_id = user_id, date = date, time = time, price = price)
                return ({"ok":True},200)
        else:
            return ({"error":True, "message":"未登入系統，拒絕存取"},403)
    except Exception as e:
        print(f"{e}:確認資訊發生錯誤")
        return ({"error":True, "message":"建立行程發生錯誤"},500)


@api_booking.route("/booking", methods=["DELETE"])
def del_booking():
    try:
        token = request.cookies.get("token")
        if token:
            data = jwt.decode(token, os.getenv("JWT_SERECT_KEY"), algorithms="HS256")
            user_id = data["id"]
            b_id = request.json.get("choose")
            delete_booking(user_id=user_id, booking_id=b_id)

            user_booking_data = select_booking(user_id=user_id)

            if not user_booking_data :  
                return ({"ok":True, "message":None})

            check_booking_data = check_booking(user_id=user_id, booking_id=b_id)
            if not check_booking_data:   
                return ({"ok":True, "message":"刪除成功"},200)
            else:
                return ({"error":True, "message":"刪除失敗"},400)
        else:
            return ({"error":True, "message":"未登入系統，存取拒絕"},403)
    except Exception as e:
        print(f"{e}:刪除行程發生錯誤")
        return ({"error":True, "message":"刪除過程發生錯誤"},500)
