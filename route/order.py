from flask import Blueprint, request, jsonify
import os, json, jwt, requests
from mysql_connect import select_booking, insert_order, select_order, update_order, delete_booking
from datetime import datetime
from utils.regex import verify_name, verify_email, verify_password, verify_phone

api_order = Blueprint("api_order", __name__)

@api_order.route("/orders", methods=["POST"])
def creat_orders():
    try:
        request_data = request.get_json()
        prime = request_data["prime"]
        contact_name = request_data["contact_name"]
        contact_email = request_data["contact_email"]
        contact_phone = request_data["contact_phone"]
        
        result = request_data["data"]
        attraction_id = result["trip"]["attraction"]["id"]
        date = result["trip"]["date"]
        time = result["trip"]["time"]
        price = result["price"]

        if len(contact_name) == 0 or len(contact_email) == 0 or len(contact_phone) == 0:
            return ({"error":True, "message": "姓名、信箱、手機號不可空白"},400)

        nameRegex = verify_name(username = contact_name)
        emailRegex = verify_email(email = contact_email)
        phoneRegex = verify_phone(phone = contact_phone)
        if not nameRegex or not emailRegex or not phoneRegex:
            return ({"error":True, "message": "姓名、信箱、手機號輸入錯誤"},400)

        token = request.cookies.get("token")
        if token:
            data = jwt.decode(token, os.getenv("JWT_SERECT_KEY"), algorithms="HS256")
            user_id = data["id"]

            currentDateAndTime = datetime.now()
            currentDate = currentDateAndTime.strftime("%Y%m%d%H%M%S")
            num = str(user_id).zfill(3)
            order_number = f"TDT{currentDate}-{num}"
            
            insert_order(
                attraction_id = attraction_id, user_id = user_id,
                contact_person = contact_name, contact_email = contact_email,
                phone = contact_phone, total_price = price, date = date, 
                time = time, order_number = order_number, status = 1
            )
            check_order = select_order(order_number=order_number,user_id=user_id)            
            if not check_order:
                return ({"error":True, "message":"訂單建立失敗"},400) 

            in_ordernumber = check_order["order_number"]

            # 銀行串接(測試環境) 
            primeURL = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
            headers = {
                "Content-Type" : "application/json",
                "x-api-key" : os.getenv("PARTNER_KEY")
            }
            pay_info = {
                "prime": prime,
                "partner_key": os.getenv("PARTNER_KEY"),
                "merchant_id": "reineTTT2_ESUN",
                "details":"TapPay Test",
                "amount": price,
                "cardholder": {
                    "phone_number": contact_phone,
                    "name": contact_name,
                    "email": contact_email,
                    "zip_code": "",
                    "address": "",
                    "national_id": ""
                },
                "remember": True
            }

            pay_res = requests.post(primeURL, headers = headers, json = pay_info, timeout = 30)
            data = pay_res.json()
            if data["status"] == 0:
                update_order(status = data["status"], order_number = in_ordernumber)

                delete_booking(user_id)

                renew_order = select_order(order_number = in_ordernumber,user_id = user_id)
                order_data = {
                    "number" : renew_order["order_number"],
                    "payment" : {
                        "status" : renew_order["status"],
                        "message" :"付款成功"
                    }
                }
                return ({"data":order_data},200)
            else:
                order_data = {
                    "number" : renew_order["order_number"],
                    "payment" : {
                        "status" :renew_order["status"],
                        "message" :"付款失敗"
                    }
                }
                return ({"data":order_data},200)    
        else:
            return ({"error":True, "message":"未登入系統，拒絕存取"},403)
    except Exception as e:
        print(f"{e}:建立訂單發生錯誤")
        return ({"error":True, "message":"建立訂單過程發生錯誤"},500)



@api_order.route("/order/<orderNumber>", methods=["GET"])
def get_order(orderNumber):
    try:
        token = request.cookies.get("token")
        if token:
            data = jwt.decode(token, os.getenv("JWT_SERECT_KEY"), algorithms="HS256")
            user_id = data["id"]
            
            renew_order = select_order(order_number=orderNumber ,user_id=user_id)
            if renew_order:
                data = {
                    "number": renew_order["order_number"],
                    "price": renew_order["total_price"],
                    "trip": {
                        "attraction": {
                            "id": renew_order["attraction_id"],
                            "name": renew_order["name"],
                            "address": renew_order["address"],
                            "image": json.loads(renew_order["images"])[0]
                        },
                        "date": renew_order["date"],
                        "time": renew_order["time"],
                    },
                    "contact": {
                        "name": renew_order["contact_person"],
                        "email": renew_order["contact_email"],
                        "phone": renew_order["phone"],
                    },
                    "status": renew_order["status"]
                }
                return ({"data":data},200)
            else:
                return ({"data":None, "message":"沒有資料"},200)
        else:
            return ({"error":True, "message":"未登入系統，拒絕存取"},403)
    except Exception as e:
        print(f"{e}:取得訂單資訊發生錯誤")
        return ({"error":True, "message":"取得訂單資訊過程發生錯誤"},500)

