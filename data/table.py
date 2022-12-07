import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

connection = mysql.connector.connect(
        user = "root",
        host = os.getenv("HOST"),
        port = os.getenv("PORT"),
        password = os.getenv("PASSWORD"),
        database = os.getenv("DATABASE"),
        charset = "utf8"
)

cursor = connection.cursor()

cursor.execute("""
            CREATE TABLE IF NOT EXISTS user(
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL);
            """)
cursor.execute("""
            ALTER TABLE user ADD INDEX 
            index_email_pwd(email,password);
            """)
            
connection.commit()