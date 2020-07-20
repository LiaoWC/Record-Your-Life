# 正式使用時，記得把debug模式改成False
ifDebugMode = True

# flask使用
from flask import Flask, render_template, request, redirect, session, jsonify, flash, url_for

# http的exception用
# from werkzeug.exceptions import HTTPException

import json
import datetime
import pSQL, func
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

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
app.secret_key = "lka#jffFJK354LSJF"

########### login-related #################
# reference: https://ithelp.ithome.com.tw/articles/10224408

login_manager = LoginManager()
login_manager.init_app(app)
# login_manager.session_protection = "strong"
login_manager.login_view = 'login'  # login()
login_manager.login_message = 'Please login first.'  # login message


class User(UserMixin):
    pass


@login_manager.user_loader
def user_loader(username):
    db = pSQL.pSQL()
    if not db.if_username_exists(username):
        return  # Don't have to anything
    user = User()
    user.id = username
    return user


@login_manager.request_loader
def request_loader(request):
    username = request.args.get('username')
    db = pSQL.pSQL()
    if not db.if_username_exists(username):
        return  # Don't have to anything
    user = User()
    user.id = username
    password = request.get('password')
    user.is_authenticated = db.if_username_password_exist_match(username, password)
    return user


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        # return the empty login form page
        return render_template('account/login.html')
    username = request.form['username']
    password = request.form['password']
    # check if the username and the password matching
    db = pSQL.pSQL()
    if db.if_username_password_exist_match(username, password):
        user = User()
        user.id = username
        login_user(user)
        # flash
        flash('Login successfully!')
        return redirect(url_for('/'))
    # login failed
    flash('Login failed!')
    return render_template('account/login.html')


@app.route('/logout')
def logout():
    username = current_user.get_id()
    logout_user()
    flash('See you, %s!' % username)
    return render_template('login.html')


###########################################

# home page
@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html')


@app.route('/get_home_page_background_image')
def get_home_page_background_image():
    return jsonify({'image_url': url_for('static', filename='img/background-1808894_1280.jpg')})


@app.route('/record_my_life')
@login_required
def record_my_life():
    # declare pSQL object
    db = pSQL.pSQL()
    # show three tables; help us to test the program
    tagsList, blocksList, blockTagPairList = db.home_display()
    # close the pSQL object
    db.close()
    return render_template('record_my_life.html', tagRows=tagsList, blockRows=blocksList,
                           blockTagPairRows=blockTagPairList)


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
    reslist = db.get_all_blocks()
    # close the pSQL object
    db.close()
    # return it to the frontend
    return json.dumps(reslist, default=func.date_to_string_converter)
    # P.S. id will be inserted into the delete-block-btn tags as a title attr


@app.route('/delete_block', methods=['POST'])
def delete_block():
    if request.method == 'POST':
        block_id = request.values['block_id']
        db = pSQL.pSQL()
        db.delete_block(block_id)
        return jsonify({"msg": 1})


@app.route('/get_tags', methods=['GET'])
def get_tags():
    keyword = request.values['Keyword']
    db = pSQL.pSQL()
    reslist = db.get_all_tags(keyword)
    db.close()
    return json.dumps(reslist)


@app.route('/edit_tags')
def edit_tags():
    return render_template('edit_tags.html')


@app.route('/register', methods=['POST', 'GET'])
def register_page():
    if request.method == 'POST':
        name = request.values['username']
        email = request.values['email']
        password = request.values['password']
        db = pSQL.pSQL()
        db.register(name, email, password)
        return jsonify({"msg": 1})
    return render_template('account/register_page.html')


# run(這一段要放在程式最後面，不然可能頁面出不來)
if __name__ == '__main__':
    app.run(port=8000, host='0.0.0.0', debug=ifDebugMode)
