import pSQL

db = pSQL.pSQL()

reList = db.blocks_info()
for item in reList:
    print(item[2])
    print(item)

db.close()
