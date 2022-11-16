import sys
sys.path.append("modules") 
import serect
import mysql.connector
import json

connection = mysql.connector.connect(
        host = "localhost",
        port = "3306",
        user = "root",
        password = serect.MySQLPassword(),
        database = "website",
        charset = "utf8"
)
cursor = connection.cursor()
cursor.execute("""
            CREATE TABLE attraction(
            id INT PRIMARY KEY AUTO_INCREMENT,
            trip_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            mrt VARCHAR(255) NULL,
            direction TEXT NOT NULL,
            description TEXT NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL,
            images text NOT NULL);
            """)
connection.commit()

with open("taipei-attractions.json", mode="r", encoding="utf-8") as response:
    data_dict = json.load(response)
    results = data_dict["result"]["results"]

    for material in results:
        trip_id = material["_id"] 
        name = material["name"]
        category = material["CAT"]
        address = material["address"]
        mrt = material["MRT"]
        direction = material["direction"]
        description = material["description"]
        latitude = float(material["latitude"]) 
        longitude = float(material["longitude"])

        image = material["file"].split("http")[1:]
        imagelist = []
        for image_url in image:
            if image_url.endswith(("jpg","JPG","png","PNG")): 
                image_url = "http" + image_url
                imagelist.append(image_url)
        imagelist_json = json.dumps(imagelist)

        insert = """
                INSERT INTO attraction(trip_id, name, category, address, mrt,
                direction, description, latitude, longitude, images)
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                """
        values = [trip_id, name, category, address, mrt, direction, description, latitude, longitude, imagelist_json]
        cursor.execute(insert, values)
        connection.commit()
