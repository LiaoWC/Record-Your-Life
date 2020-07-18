# 正式使用時，記得把debug模式改成False
ifDebugMode = True

# flask使用
from flask import Flask, render_template, request, redirect, session, jsonify

# http的exception用
# from werkzeug.exceptions import HTTPException

import json
import datetime
import pSQL, func

#
# db = psycopg2.connect(connect_str)
# cur = db.cursor()
# # cur.execute("SELECT * FROM B;")
# # print(cur.fetchall())
# print(cur.execute("INSERT INTO b VALUES (%s)", ('166560',)))
# cur.close()
# db.commit()
# db.close()
# db = pSQL.pSQL()
# kkk = db.exec("insert into a(ddd) values ('2025-7-7');",0)
# print(kkk)

app = Flask(__name__)


# home page
@app.route('/')
def index():
    # declare pSQL object
    db = pSQL.pSQL()
    # show three tables; help us to test the program
    tagsList, blocksList, blockTagPairList = db.home_display()
    # close the pSQL object
    db.close()
    return render_template('index.html', tagRows=tagsList, blockRows=blocksList, blockTagPairRows=blockTagPairList)


# address record_form that users had submited
@app.route('/submit_record_form', methods=['POST'])
def submit_record_form():
    if request.method == 'POST':
        # Take out the data
        title = request.values['Title']
        description = request.values['Description']
        tags = request.values['Tags']
        func.turn_json_array_string_into_list(tags)
        date = request.values['Date']
        db = pSQL.pSQL()
        db.receive_record_submit(title, description, tags, date)
        db.close()
        # Put into the database
        return jsonify({"msg": 1})
    else:
        return jsonify({"msg": 0})


@app.route('/show_blocks', methods=['GET'])
def show_blocks():
    # declare pSQL object
    db = pSQL.pSQL()
    # call the function and get the result
    reslist = db.blocks_info()
    # close the pSQL object
    db.close()
    # return it to the frontend\
    return json.dumps(reslist, default=func.date_to_string_converter)
    # P.S. id will be inserted into the delete-block-btn tags as a title attr


@app.route('/delete_block', methods=['POST'])
def delete_block():
    if request.method == 'POST':
        block_id = request.values['block_id']
        db = pSQL.pSQL()
        db.delete_block(block_id)
        return jsonify({"msg": 1})


# run(這一段要放在程式最後面，不然可能頁面出不來)
if __name__ == '__main__':
    app.run(port=8000, host='0.0.0.0', debug=ifDebugMode)
