# 正式使用時，記得把debug模式改成False
ifDebugMode = True

# flask使用
from flask import Flask, render_template, request, redirect, session, jsonify

# http的exception用
# from werkzeug.exceptions import HTTPException

# postgresql adapter
import psycopg2
import pSQL

connect_str = "dbname='smallfish' user='smallfish' host='localhost' " + "password='smallfish'"
# use our connection values to establish a connection
conn = psycopg2.connect(connect_str)
# create a psycopg2 cursor that can execute queries
cursor = conn.cursor()
# create a new table with a single column called "name"
cursor.execute("select * from blocks;")
# run a SELECT statement - no data in there, but we can try it
# cursor.execute("""SELECT * from tutorials""")
conn.commit()  # <--- makes sure the change is shown in the database
rows = cursor.fetchall()

for row in rows:
    print(row)

cursor.close()
conn.close()

app = Flask(__name__)


# home page
@app.route('/')
def index():
    return render_template('index.html')


# address record_form that users had submited
@app.route('/submit_record_form', methods=['POST'])
def submit_record_form():
    if request.method == 'POST':
        title = request.values['Title']
        description = request.values['Description']
        tags = request.values['Tags']
        date = request.values['Date']
        print(type(title), type(description),type(tags),type(date))
        print(title,description,tags,date)
        return jsonify({"msg":1})
    else:
        return jsonify({"msg":0})



# run(這一段要放在程式最後面，不然可能頁面出不來)
if __name__ == '__main__':
    app.run(port=8000, host='0.0.0.0', debug=ifDebugMode)
