import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

connection = mysql.connector.connect(
        host = os.getenv("HOST"),
        port = os.getenv("PORT"),
        user = os.getenv("MYSQL_USER"),
        password = os.getenv("PASSWORD"),
        database = os.getenv("DATABASE"),
        charset = "utf8"
)

cursor = connection.cursor()

cursor.execute("""
        CREATE TABLE IF NOT EXISTS user(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,#設置UNIQUE 和index相同，差異在於不能允許重複值
        password VARCHAR(100) NOT NULL);
        """)
# cursor.execute("""
#         ALTER TABLE user ADD INDEX 
#         index_email_pwd(email,password);
#         """)

cursor.execute("""
        CREATE TABLE IF NOT EXISTS booking(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        attraction_id INT NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(100) NOT NULL,
        price INT NOT NULL);
        """)
# cursor.execute("""
#         ALTER TABLE booking 
#         ADD FOREIGN KEY(user_id) 
#         REFERENCES user(id);
#         """)

cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        attraction_id INT NOT NULL,
        contact_person VARCHAR(50) NOT NULL,
        contact_email VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(100) NOT NULL,
        total_price BIGINT NOT NULL,
        order_number VARCHAR(255) NOT NULL UNIQUE,
        status TINYINT NOT NULL);
        """)
cursor.execute("""
        ALTER TABLE orders 
        ADD FOREIGN KEY(user_id) 
        REFERENCES user(id);
        """)
  

connection.commit()