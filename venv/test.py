import pSQL

db = pSQL.pSQL()
db.cur.execute("SELECT * FROM blocks;")
print(db.cur.fetchone())
print(db.cur.fetchall())
