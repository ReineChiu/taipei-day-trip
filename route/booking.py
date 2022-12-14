from flask import Blueprint, request, jsonify
import os, json, jwt, datetime
from mysql_connect import select_booking, insert_booking, update_booking, delete_booking


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
            booking_data = select_booking(user_id)
            if booking_data:
                data = {
                    "attraction":{
                        "id": booking_data["attraction_id"],
                        "name": booking_data["name"],
                        "address": booking_data["address"],
                        "image": json.loads(booking_data["images"])[0],
                    },
                    "date": booking_data["date"],
                    "time": booking_data["time"],
                    "price": booking_data["price"]
                }
                return ({"data":data},200)
            else:
                data = None
                return ({"data":data},200)
        else:
            data = None
            return ({"data":data},200)

    except Exception as e:
        print(f"{e}:確認資訊發生錯誤")
        return ({"error":True, "message":"確認身份過程發生錯誤"},500)

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
            result = select_booking(user_id)
            if result:
                update = update_booking(attraction_id, date, time, price, user_id)
                confirm = select_booking(user_id)
                if confirm:
                    return ({"ok":True},200)
                else:
                    return ({"error":True, "message":"更新行程失敗"},400)
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
            delete = delete_booking(user_id)
            check_booking = select_booking(user_id)
            if not check_booking:
                return ({"ok":True},200)
            else:
                return ({"error":True, "message":"刪除失敗"},400)
        else:
            return ({"error":True, "message":"未登入系統，存取拒絕"},403)
    except Exception as e:
        print(f"{e}:確認資訊發生錯誤")
        return ({"error":True, "message":"刪除過程發生錯誤"},500)
