import pSQL

db = pSQL.pSQL()

db.get_all_tags()
# reList = db.blocks_info()
# for item in reList:
#     print(item[2])
#     print(item)

db.close()

