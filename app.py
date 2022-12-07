from flask import Flask, render_template, request, Blueprint, jsonify, make_response
from route.attraction import api_attraction
from route.auth import api_auth
from dotenv import load_dotenv
import os, jwt

load_dotenv()

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSONIFY_MIMETYPE'] ="application/json;charset=utf-8"

app.register_blueprint(api_attraction, url_prefix="/api")
app.register_blueprint(api_auth, url_prefix="/api") 

@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


if __name__ =='__main__':		
	app.run(host="0.0.0.0", port=3000)
	