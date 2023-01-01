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
        cursor = connection_object.cursor(dictionary=True)
        
        trip_list = []
        if keyword:
            select = ('''SELECT * FROM attraction WHERE 
                        name REGEXP %s 
                        or category REGEXP %s
                        LIMIT %s, %s''')
            value = [keyword, keyword, start, amount]
            cursor.execute(select, value)
            results = cursor.fetchall() 
            for data in results: 
                data["images"] = json.loads(data["images"]) 
                trip_list.append(data)
            return trip_list
        else:
            select = ("SELECT * FROM attraction LIMIT %s, %s")
            value = [start, amount]
            cursor.execute(select, value)
            results = cursor.fetchall() 

            for data in results:
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
        cursor = connection_object.cursor(dictionary=True)
        select = ("SELECT * FROM attraction WHERE id=%s")
        id = [attractionId]
        cursor.execute(select, id)
        result = cursor.fetchone()
        if result:
            result["images"] = json.loads(result["images"])
            return result
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
        cursor = connection_object.cursor(dictionary=True)
        select = ("select * from user where ")
        for key in kwargs:
            select = select + f"{key}= '{kwargs[key]}' and "
        select = select[:-5]
        cursor.execute(select)
        account = cursor.fetchone()
        if account:
            return account
        else:
            print("此信箱未被使用")
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

def update_user(username, user_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        update = ("update user set username=%s where id=%s")

        value = [username, user_id]
        cursor.execute(update, value)
        connection_object.commit()
        result = cursor.fetchone()     
        pass

    except Exception as e:
        print(f"{e}:更新姓名資料失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()


# ----------------- booking 行程資料表---------------------- #
def select_booking(user_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)
        select = ("""
                SELECT 
                    b.id as booking_id,
                    b.attraction_id,
                    b.date,
                    b.time,
                    b.price,
                    a.id,
                    a.name,
                    a.address,
                    a.images
                FROM booking as b INNER JOIN 
                    attraction as a on b.attraction_id=a.id
                WHERE user_id=%s""")

        userid = [user_id]
        cursor.execute(select, userid)
        account = cursor.fetchall()
        if account:
            booking_list = []
            for data in account:
                data["images"] = json.loads(data["images"]) 
                booking_list.append(data)
            return booking_list
        else:
            print("查無預約行程資料")
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
            if type(kwargs[key]) == str:
                insert_val = insert_val + f"'{kwargs[key]}', "
            else:
                insert_val = insert_val + f"{kwargs[key]}, "
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

def check_booking(user_id,booking_id):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)
        select = ("select * from booking where user_id=%s and id=%s")
        value = [user_id,booking_id]
        cursor.execute(select, value)
        result = cursor.fetchone() #< class 'list'>        
        return result
    except Exception as e:
        print(f"{e}:檢查預約行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()
check_booking(17,53)

def delete_booking(**kwargs):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        delete = ("delete from booking where ")
        for key in kwargs:          
            if type(kwargs[key]) == str:
                delete = delete + f"{key}='{kwargs[key]}' and "
            else:
                delete = delete + f"{key}={kwargs[key]} and "
        delete = delete[:-5]

        cursor.execute(delete)
        connection_object.commit()

    except Exception as e:
        print(f"{e}:刪除行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()

# ----------------- orders 訂單資料表---------------------- #
def insert_order(**kwargs):
    try:
        insert_col = ""
        insert_val = ""
        for key in kwargs:
            insert_col = insert_col + f"{key}, "
            if type(kwargs[key]) == str:
                insert_val = insert_val + f"'{kwargs[key]}', "
            else:
                insert_val = insert_val + f"{kwargs[key]}, "
        insert_col = insert_col[:-2]
        insert_val = insert_val[:-2]
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        
        insert = f"""
                INSERT INTO orders({insert_col})
                VALUES({insert_val})
                """
        cursor.execute(insert)
        connection_object.commit()
    except Exception as e:
        print(f"{e}:寫入訂購行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()

def select_order(**kwargs):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)
        select = ("""
            SELECT 
                o.user_id,
                o.attraction_id,
                o.contact_person,
                o.contact_email,
                o.phone,
                o.price,
                o.date,
                o.time,
                o.order_number,
                o.status,
                a.id,
                a.name,
                a.address,
                a.images,
                u.id
            FROM orders as o INNER JOIN
                attraction as a on o.attraction_id=a.id
                INNER JOIN user as u on o.user_id=u.id WHERE """)

        for key in kwargs:
            if type(kwargs[key]) == str:
                select = select + f"{key}='{kwargs[key]}' and "
            else:
                select = select + f"{key}={kwargs[key]} and "
        select = select[:-5]
        cursor.execute(select)
        account = cursor.fetchall()
        if account:
            orders_list = []
            for data in account:
                data["images"] = json.loads(data["images"]) 
                orders_list.append(data)
            return orders_list
        else:
            print("查無訂單資料")
            return None
    except Exception as e:
        print(f"{e}:查詢行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()

def get_totalprice(user_id,order_number):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        sql = ("""
            select sum(price) as price總和 from orders 
            where user_id=%s and order_number=%s 
            """)
        value = [user_id, order_number]
        cursor.execute(sql, value)
        account = cursor.fetchone()
        price = ''.join('%s' %id for id in account)
        return price
    except Exception as e:
        print(f"{e}:取得總金額失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()

def update_order(status, order_number):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        update = ('''
            UPDATE orders SET
            status=%s where order_number=%s;
            ''')
        value = [status, order_number]
        cursor.execute(update, value)
        connection_object.commit()
        results = cursor.fetchone()  
    except Exception as e:
        print(f"{e}:更新預定行程失敗")
        return None
    finally:
        cursor.close()
        connection_object.close()
