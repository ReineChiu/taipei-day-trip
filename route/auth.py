from flask import Blueprint, request, make_response
import os, json, jwt, datetime, bcrypt
from dotenv import load_dotenv
from mysql_connect import select_user, insert_user
from utils.regex import verify_name, verify_email, verify_password

load_dotenv()

api_auth = Blueprint("api_auth", __name__)

@api_auth.route("/user", methods=["POST"])
def singup():
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")

    if len(username) == 0 or len(email) == 0 or len(password) == 0:
        return ({"error":True, "message": "姓名、信箱、密碼不可空白"},400)

    nameRegex = verify_name(username = username)
    emailRegex = verify_email(email = email)
    passwordRegex = verify_password(password = password)
    if not nameRegex or not emailRegex or not passwordRegex:
        return ({"error":True, "message": "姓名、信箱、密碼輸入資料格式錯誤"},400)

    register_user = select_user(email = email)
    if register_user:
        return ({"error":True, "message":"信箱已被註冊"},400)
    if not register_user:

        try:
            en_pwd = password.encode('utf-8')
            hashed = bcrypt.hashpw(en_pwd, bcrypt.gensalt())
            hashed_decode = bcrypt.hashpw(en_pwd, bcrypt.gensalt()).decode('utf-8')
            insert_user(username = username, email = email, password = hashed_decode) # 將hash完的password.decode,存進資料庫
            confirm_user = select_user(email = email, password = hashed_decode)
            if confirm_user:
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
            data.pop("exp")
            return ({"data":data},200)
        else:
            return ({"data":None},200)
    except Exception as e:
        print(f"{e}:確認資訊發生錯誤")
        return ({"error":True, "message":"確認身份過程發生錯誤"},500)
   
@api_auth.route("/user/auth", methods=["PUT"])
def loginin():
    email = request.json.get("email")
    password = request.json.get("password")
    
    if len(email) == 0 or len(password) == 0:
        return ({"error":True, "message": "信箱、密碼不可空白"},400)

    emailRegex = verify_email(email = email)
    passwordRegex = verify_password(password = password)
    if not emailRegex or not passwordRegex:
        return ({"error":True, "message": "信箱、密碼輸入資料格式錯誤"},400)
    
    user = select_user(email = email)
    try:
        if user:
            en_pwd = password.encode('utf-8')
            hashed = user["password"].encode('utf-8')# 跟資料庫密碼比對依據
            if bcrypt.checkpw(en_pwd, hashed):
                token = jwt.encode({"id":user["id"],
                                    "username":user["username"],
                                    "email":user["email"], 
                                    "exp":datetime.datetime.utcnow()+datetime.timedelta(days=7)},
                                    os.getenv("JWT_SERECT_KEY"))
                response = make_response({"ok":True},200)
                response.set_cookie("token",token)
                return (response)
            else:
                return ({"error":True, "message":"密碼輸入錯誤"},400)
        else:
            return ({"error":True, "message":"帳號或密碼輸入錯誤"},400)
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

