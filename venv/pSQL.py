#
connect_str = "dbname='smallfish' user='smallfish' host='localhost' password='smallfish'"

from func import solve_apostrophe, turn_json_array_string_into_list


class pSQL:
    def __init__(self):
        # postgresql adapter
        import psycopg2
        self.conn = psycopg2.connect(connect_str)
        # create a psycopg2 cursor that can execute queries
        self.cur = self.conn.cursor()

    # This is disabled because it's not elastic.
    # # return the result list
    # def exec(self, sql_query, if_fetch):
    #     try:
    #         self.cur.execute(sql_query)
    #         self.conn.commit()  # <--- makes sure the change is shown in the database
    #         if if_fetch is not 0:
    #             rows = self.cur.fetchall()
    #             for row in rows:
    #                 print(row)
    #             return rows
    #         else:
    #             empty_res = []
    #             return empty_res
    #     except Exception as e:
    #         empty_res = []
    #         print(e)
    #         return empty_res
    # This is disabled because it's not elastic.
    # # return the result list
    # def exec(self, sql_query, if_fetch):
    #     try:
    #         self.cur.execute(sql_query)
    #         self.conn.commit()  # <--- makes sure the change is shown in the database
    #         if if_fetch is not 0:
    #             rows = self.cur.fetchall()
    #             for row in rows:
    #                 print(row)
    #             return rows
    #         else:
    #             empty_res = []
    #             return empty_res
    #     except Exception as e:
    #         empty_res = []
    #         print(e)
    #         return empty_res

    def close(self):
        self.cur.close()
        self.conn.close()

    # reutrn err (1 means there's an error.)
    def receive_record_submit(self, title, description, tags, date):
        # solve single quote problems
        title = solve_apostrophe(title)
        description = solve_apostrophe(description)
        tagsList = turn_json_array_string_into_list(tags)
        date = solve_apostrophe(date)
        # insert into table blocks
        sql = "INSERT INTO blocks(title,description,last_edited_date) VALUES('%s','%s','%s') RETURNING id;" % (
            title, description, date)
        self.cur.execute(sql)
        self.conn.commit()
        id_of_new_block = self.cur.fetchone()[0]
        # dealing with each tag
        for tag in tagsList:
            # find if this tag exists
            sql = "SELECT * FROM tags where name = '%s';" % tag
            self.cur.execute(sql)
            self.conn.commit()
            resTuple = self.cur.fetchone()
            id_of_new_tag = -1  # declare
            if resTuple:  # already exists
                id_of_new_tag = resTuple[0]
            else:  # not exists
                # create a tag
                sql = "INSERT INTO tags(name) VALUES('%s') RETURNING id;" % tag
                self.cur.execute(sql)
                self.conn.commit()
                id_of_new_tag = self.cur.fetchone()[0]
            # insert into tag_block_pairs
            sql = "INSERT INTO tag_block_pairs(block_id,tag_id) VALUES(%s,%s);" % (id_of_new_block, id_of_new_tag)
            self.cur.execute(sql)
            self.conn.commit()

    # display all the tags and all the blocks in home page
    # return two lists containing tuples(one row is one tuple): tagsList and blocksList
    def home_display(self):
        #
        sql = "SELECT * FROM tags;"
        self.cur.execute(sql)
        self.conn.commit()
        tagsList = self.cur.fetchall()
        #
        sql = "SELECT * FROM blocks;"
        self.cur.execute(sql)
        self.conn.commit()
        blocksList = self.cur.fetchall()
        #
        sql = "SELECT * FROM tag_block_pairs;"
        self.cur.execute(sql)
        self.conn.commit()
        blockTagPairList = self.cur.fetchall()
        return tagsList, blocksList, blockTagPairList

    # show blocks info, integrated with tags
    # return: a list containing lists
    # every internal list is one block, containing:
    # [ id(int), Title(str), description(str), date(str), tags(list of strings) ]
    def get_all_blocks(self):
        sql = "SELECT id,title,description,last_edited_date FROM blocks;"
        self.cur.execute(sql)
        self.conn.commit()
        blocks_list = self.cur.fetchall()
        outer_list = []
        for row_of_blocks in blocks_list:
            # place title, description, date in the internal_list
            internal_list = [row_of_blocks[0], row_of_blocks[1], row_of_blocks[2], row_of_blocks[3]]
            block_id = row_of_blocks[0]
            # finding tags and place it in the list
            sql = "SELECT tags.name FROM tags,tag_block_pairs tbp WHERE tbp.block_id = %s and tags.id = tbp.tag_id;" % block_id
            self.cur.execute(sql)
            self.conn.commit()
            tags_list_from_query = self.cur.fetchall()
            tag_list = []
            for row in tags_list_from_query:
                tag_list.append(row[0])
            internal_list.append(tag_list)
            # put it in the outer_list
            outer_list.insert(0, internal_list)
        return outer_list

    def delete_block(self, block_id):
        block_id = int(block_id)
        sql = "DELETE FROM tag_block_pairs t WHERE t.block_id = %s;" % block_id
        self.cur.execute(sql)
        self.conn.commit()
        sql = "DELETE FROM blocks WHERE blocks.id = %s;" % block_id
        self.cur.execute(sql)
        self.conn.commit()

    def get_all_tags(self, keyword):
        keyword = solve_apostrophe(keyword)
        sql = "SELECT id,name FROM tags WHERE name like '%%%s%%' ORDER BY name;" % keyword
        self.cur.execute(sql)
        self.conn.commit()
        resList = self.cur.fetchall()
        return resList

    # return if the username exists in the database, table users
    def if_username_exists(self, username):
        username = solve_apostrophe(username)
        sql = "SELECT * FROM users WHERE name = '%s'" % username
        self.cur.execute(sql)
        self.conn.commit()
        resList = self.cur.fetchall()
        return False if len(resList) is 0 else True

    # return if the username and password exist and match
    def if_username_password_exist_match(self, username, password):
        # check if the username exists first
        if not self.if_username_exists(username):
            return False
        # check if matching
        sql = "SELECT * FROM users WHERE name = '%s' and password = '%s';" % (
            solve_apostrophe(username), solve_apostrophe(password))
        self.cur.execute(sql)
        self.conn.commit()
        resList = self.cur.fetchall()
        return False if len(resList) is 0 else True

    def register(self, name, email, password):
        sql = "INSERT INTO users (name,email,password) VALUES ('%s','%s','%s');" \
              % (solve_apostrophe(name), solve_apostrophe(email), solve_apostrophe(password))
        self.cur.execute(sql)
        self.conn.commit()
        return

    ######### not finished ######

    def add_a_tags(self, tag_name):
        sql = "INSERT INTO tags(name"
