from flask import Flask,render_template,request,jsonify,url_for



app=Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/home")
def home_page():
    return render_template("home.html")


@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/study")
def study():
    return render_template("study.html")

@app.route("/tasks")
def tasks():
    return render_template("tasks.html")




if __name__=="__main__":
    app.run(debug=True)