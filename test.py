import pSQL

db = pSQL.pSQL()






username = "jj"
password = "jjj"

print(db.if_username_password_exist_match(username,password))







db.close()


