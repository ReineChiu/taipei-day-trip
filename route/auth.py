from flask import Blueprint, request, make_response
import os, re, json, jwt, datetime
from dotenv import load_dotenv
from mysql_connect import select_user, inser_user

load_dotenv()

api_auth = Blueprint("api_auth", __name__)

@api_auth.route("/user", methods=["POST"])
def singup():
    try:
        name = request.json.get("name")
        email = request.json.get("email")
        password = request.json.get("password")
        if len(name) == 0 or len(email) == 0 or len(password) == 0:
            return ({"error":True, "message": "姓名、信箱、密碼不可空白"},400)

        nameRegex = re.match("^[A-za-z0-9\u4e00-\u9fa5]*$",name)
        emailRegex = re.match("^[A-za-z0-9_.-]+@[A-Za-z0-9-]+$",email)
        passwordRegex = re.match("^(?=.*\d).{6,20}$",password)
        if not nameRegex or not emailRegex or not passwordRegex:
            return ({"error":True, "message": "姓名、信箱、密碼輸入資料格式錯誤"},400)

        register_user = select_user(email = email)
        if register_user:
            return ({"error":True, "message":"信箱已被註冊"},400)

        inser_user(name = name, email = email, password = password)
        confirmuser = select_user(email = email, password = password)
        if confirmuser:
            return ({"ok":True},200)
        else:
            return ({"error":True, "message":"信箱已被使用"},400)
    except Exception as e:
        print(f"{e}:註冊過程失敗")
        return ({"error":True, "message":"註冊過程發生錯誤"},500)

@api_auth.route("/user/auth", methods=["GET"])
def check_user():
    try:
        token = request.cookies.get("token")
        if token:
            data = jwt.decode(token, os.getenv("JWT_SERECT_KEY"), algorithms="HS256")
            print(data)
            data.pop("exp")
            return ({"data":data},200)
        else:
            data = None
            return ({"data":data},200)
    except Exception as e:
        print(f"{e}:確認資訊發生錯誤")
        return ({"error":True, "message":"確認身份過程發生錯誤"},500)
   
@api_auth.route("/user/auth", methods=["PUT"])
def loginin():
    email = request.json.get("email")
    password = request.json.get("password")
    if len(email) == 0 or len(password) == 0:
        return ({"error":True, "message": "信箱、密碼不可空白"},400)

    emailRegex = re.match("^[A-za-z0-9_.-]+@[A-Za-z0-9-]+$",email)
    passwordRegex = re.match("^(?=.*\d).{6,20}$",password)   
    if not emailRegex or not passwordRegex:
        return ({"error":True, "message": "信箱、密碼輸入資料格式錯誤"},400)

    try:
        user = select_user(email = email, password = password)
        if user:
            email = user["email"]
            pasword = user["password"]
            token = jwt.encode({"id":user["id"],
                                "name":user["name"],
                                "email":user["email"], 
                                "exp":datetime.datetime.utcnow()+datetime.timedelta(days=7)},
                                os.getenv("JWT_SERECT_KEY"))
            print(token)
            response = make_response({"ok":True},200)
            response.set_cookie("token",token)

            return (response)
        else:
            return ({"error":True, "message":"登入資料輸入錯誤"},200)
    except Exception as e:
        print(f"{e}:登入過程失敗")
        return ({"error":True, "message":"登入過程發生錯誤"},500)

@api_auth.route("/user/auth", methods=["DELETE"])
def logout():
    try:
        response = make_response({"ok":True},200)
        response.delete_cookie("token")
        return (response)
    except Exception as e:
        print(f"{e}:登出發生錯誤")
        return ({"error":True, "message":"登出過程發生錯誤"},500)

