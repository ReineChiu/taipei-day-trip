from mysql.connector import Error
from mysql.connector import pooling
import mysql.connector
import json
from dotenv import load_dotenv
import os

load_dotenv()

connection_pool = pooling.MySQLConnectionPool(pool_name = "pynative_pool",
                                              pool_size = 5,
                                              host = os.getenv("HOST"),
                                              user = os.getenv("MYSQL_USER"),                           
                                              database = os.getenv("DATABASE"),  
                                              password = os.getenv("PASSWORD"),#serect.MySQLPassword(),
                                              charset = "utf8")

# ----------------- attraction 景點資料表---------------------- #
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


# ----------------- user 用戶資料表---------------------- #
def select_user(**kwargs):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        select = ("select * from user where ")
        for key in kwargs:
            select = select + f"{key}= '{kwargs[key]}' and "
        select = select[:-5]
        cursor.execute(select)
        account = cursor.fetchone()
        if account:
            columns = [col[0] for col in cursor.description]
            data = dict(zip(columns, account))
            return data
        else:
            print("查無資料")
            return None
    except Exception as e:
        print(f"{e}:註冊失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()


def insert_user(**kwargs):
    try:
        insert_col = ""
        insert_val = ""
        for key in kwargs:
            insert_col = insert_col + f"{key}, "
            insert_val = insert_val + f"'{kwargs[key]}', "
        insert_col = insert_col[:-2]
        insert_val = insert_val[:-2]

        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        insert = f"""
                insert into user({insert_col})
                value({insert_val})
                """
        cursor.execute(insert)
        connection_object.commit()
    except Exception as e:
        print(f"{e}:註冊資料失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()


# ----------------- booking 行程資料表---------------------- #
def select_booking(user_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        select = ('''
            SELECT 
                b.id,
                b.attraction_id,
                b.date,
                b.time,
                b.price,
                a.id,
                a.name,
                a.address,
                a.images,
                u.id,
                u.username,
                u.email
            FROM booking as b INNER JOIN 
                attraction as a on b.attraction_id=a.id
                INNER JOIN user as u on b.user_id=u.id
            WHERE u.id=%s;
            ''')
        userid = [user_id]
        cursor.execute(select, userid)
        account = cursor.fetchone()
        if account:
            columns = [col[0] for col in cursor.description]
            data = dict(zip(columns, account))
            return data
        else:
            print("查無資料")
            return None
    except Exception as e:
        print(f"{e}:查詢行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()


def insert_booking(**kwargs):
    try:
        insert_col = ""
        insert_val = ""
        for key in kwargs:
            insert_col = insert_col + f"{key}, "
            insert_val = insert_val + f"'{kwargs[key]}', "
        insert_col = insert_col[:-2]
        insert_val = insert_val[:-2]

        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        insert = f"""
                insert into booking({insert_col})
                value({insert_val})
                """
        cursor.execute(insert)
        connection_object.commit()
    except Exception as e:
        print(f"{e}:寫入預定行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()

  
def update_booking(attraction_id, date, time, price, user_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        update = ('''
            update booking set 
            attraction_id=%s,
            date=%s,
            time=%s,
            price=%s
            where user_id=%s;
            ''')
        value = [attraction_id, date, time, price, user_id]
        cursor.execute(update, value)
        connection_object.commit()
        results = cursor.fetchone()      
    except Exception as e:
        print(f"{e}:更新預定行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()


def delete_booking(user_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        delete = ("delete from booking where user_id=%s;")
        value = [user_id]
        cursor.execute(delete, value)
        connection_object.commit()
    except Exception as e:
        print(f"{e}:刪除行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()

