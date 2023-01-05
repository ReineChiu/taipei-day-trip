from flask import Flask, render_template, request, Blueprint, jsonify, make_response
from dotenv import load_dotenv
import os, jwt

from route.attraction import api_attraction
from route.auth import api_auth
from route.booking import api_booking
from route.order import api_order
from route.upload import api_upload


load_dotenv()

app=Flask(
    __name__,
    static_folder="static",
    static_url_path="/static"
    )
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSONIFY_MIMETYPE'] ="application/json;charset=utf-8"


app.register_blueprint(api_attraction, url_prefix="/api")
app.register_blueprint(api_auth, url_prefix="/api")
app.register_blueprint(api_booking, url_prefix="/api")
app.register_blueprint(api_order, url_prefix="/api")
app.register_blueprint(api_upload, url_prefix="/api") 



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


@app.route("/member")
def member():
    return render_template("member.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404



if __name__ =='__main__':	
    app.run(host="0.0.0.0", port=3000)
    