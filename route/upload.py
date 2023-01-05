from flask import Blueprint, request, jsonify, url_for
import os, json, jwt, requests
from mysql_connect import select_file, update_file, insert_file



api_upload = Blueprint("api_upload", __name__)

# 上傳圖片位置
basedir = os.path.dirname(os.path.dirname(__file__))

# 確認圖片類型
ALLOWED_IMAGE_EXTENSIONS = {'image/png', 'image/jpg', 'image/jpeg'}


@api_upload.route("/upload", methods=["PUT"])
def up_photo():
    try:
        image_file = request.files.get('image')
        if image_file is None:
            return ({"error":True, "message":"文件上傳失敗"},400) 
        if image_file.content_type not in ALLOWED_IMAGE_EXTENSIONS:
            return ({"error":True, "message":"不支援檔案類型"},400) 
            
        path = basedir+"/static/avatar/"
        image_file.save(path + image_file.filename)
        file_url = url_for("static", filename="avatar/" + image_file.filename)

        token = request.cookies.get("token")
        if token:
            data = jwt.decode(token, os.getenv("JWT_SERECT_KEY"), algorithms="HS256")
            user_id = data["id"]
            url = select_file(user_id=user_id)
            if url:
                update_file(url=file_url,user_id=user_id)
                result = select_file(user_id=user_id,url=file_url)
                if result:
                    return ({"ok":True, "data":result, "message":"檔案更新成功"},200)
                else:
                    return ({"error":True, "data":None, "message":"檔案更新失敗"},400)

            else:
                insert_file(user_id=user_id,url=file_url)
                result = select_file(user_id=user_id,url=file_url)
                if result:
                    return ({"ok":True, "data":result, "message":"新增檔案成功"},200)
                else:
                    return ({"error":True, "data":None, "message":"新增檔案失敗"},400)
    except Exception as e:
        print(f"{e}:接收上傳圖片失敗")
        return ({"error":True, "message":"伺服器發生錯誤"},500)

@api_upload.route("/upload", methods=["GET"])
def get_photo():
    try:
        token = request.cookies.get("token")
        if token:
            data = jwt.decode(token, os.getenv("JWT_SERECT_KEY"), algorithms="HS256")
            user_id = data["id"]
            result = select_file(user_id=user_id)
            if result:
                return ({"ok":True, "data":result},200)
            else:
                return ({"error":True, "data":None},400)
        else:
            return ({"error":True, "message":"未登入系統，拒絕存取"},403)
    except Exception as e:
        print(f"{e}:取得資料庫圖片失敗")
        return ({"error":True, "message":"伺服器發生錯誤"},500)
 
